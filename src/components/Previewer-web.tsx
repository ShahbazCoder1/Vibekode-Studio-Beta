"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Download,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Minus,
  Plus,
  Maximize,
  Loader2,
  UploadCloud,
  ExternalLink,
  Copy,
  X,
  CheckCircle,
  Globe,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { deployToNetlify } from "@/backend/deploy";
import {
  saveDeploymentInfo,
  getDeploymentInfo,
  DeploymentInfo,
  getProject,
  getLatestGeneratedCode,
  getUserSubscriptionType,
} from "@/lib/firebase";
import { cn } from "@/lib/utils";


// Define the types for our component props
interface PreviewerProps {
  projectId?: string;
  hasGeneratedCode?: boolean; // Add flag to track if code has been generated
}

interface PreviewComponentProps {
  isLoading: boolean;
  htmlContent: string;
  sandboxAttributes: string;
}

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  deploymentInfo: DeploymentInfo | null;
  deploymentError: string;
  hasNewVersion: boolean;
  isUpdating: boolean;
  onUpdate: () => Promise<void>;
  onCopyToClipboard: (text: string) => void;
}

// Define the device types
type Device = "mobile" | "tablet" | "laptop" | "desktop" | "fullscreen";

// Component-specific type for device configurations
type DeviceConfig = {
  label: string;
  icon: React.ElementType;
};

const devices: Record<Device, DeviceConfig> = {
  mobile: { label: "Mobile", icon: Smartphone },
  tablet: { label: "Tablet", icon: Tablet },
  laptop: { label: "Laptop", icon: Laptop },
  desktop: { label: "Desktop", icon: Monitor },
  fullscreen: { label: "Fullscreen", icon: Maximize },
};

// Toast component for notifications
const Toast = ({ message, onDismiss }: { message: string; onDismiss: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-5 right-5 bg-gray-800 text-white py-2 px-4 rounded-lg shadow-lg flex items-center"
    >
      <CheckCircle className="mr-2 text-green-400" size={16} />
      {message}
    </motion.div>
  );
};

export default function Previewer({
  projectId,
  hasGeneratedCode = false,
}: PreviewerProps) {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [selectedDevice, setSelectedDevice] = useState<Device>("fullscreen");
  const [zoom, setZoom] = useState<number>(0.9);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deploymentInfo, setDeploymentInfo] = useState<DeploymentInfo | null>(
    null
  );
  const [showDeploymentModal, setShowDeploymentModal] = useState(false);
  const [deploymentError, setDeploymentError] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [hasNewVersion, setHasNewVersion] = useState<boolean>(false);
  const [lastDeployedCode, setLastDeployedCode] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [subscriptionType, setSubscriptionType] = useState<'free' | 'go' | 'pro'>('free');

  useEffect(() => {
    const checkPremiumStatus = async () => {
      const subType = await getUserSubscriptionType();
      setSubscriptionType(subType);
      setIsPremium(subType === 'go' || subType === 'pro');
    };

    checkPremiumStatus();
  }, []);

  const contentRef = useRef<string>(htmlContent);

  useEffect(() => {
    const defaultConsoleHTML = "https://preview.vibekode.studio/";
    const codeToRender =
      projectId && hasGeneratedCode
        ? `https://preview.vibekode.studio/preview/${projectId}?token=${process.env.NEXT_PUBLIC_PREVIEW_TOKEN}`
        : defaultConsoleHTML;

    setHtmlContent(codeToRender);
    contentRef.current = codeToRender;
    setIsLoading(true);

    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [projectId, hasGeneratedCode]);

  const handleDeviceChange = (device: Device) => {
    setSelectedDevice(device);
    setIsLoading(true);
    setHtmlContent(contentRef.current);
    setTimeout(() => setIsLoading(false), 500);
  };

  const loadDeploymentInfo = useCallback(async () => {
    if (!projectId) return;
    try {
      const info = await getDeploymentInfo(projectId);
      setDeploymentInfo(info);
    } catch (error) {
      console.error("Error loading deployment info:", error);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      loadDeploymentInfo();
    }
  }, [projectId, loadDeploymentInfo]);

  const checkForNewVersion = useCallback(async () => {
    if (!projectId || !deploymentInfo) return;
    try {
      const latestCode = await getLatestGeneratedCode(projectId);
      if (latestCode && latestCode !== lastDeployedCode) {
        setHasNewVersion(true);
      } else {
        setHasNewVersion(false);
      }
    } catch (error) {
      console.error("Error checking for new version:", error);
    }
  }, [projectId, deploymentInfo, lastDeployedCode]);

  useEffect(() => {
    if (projectId && hasGeneratedCode && deploymentInfo) {
      checkForNewVersion();
    }
  }, [projectId, hasGeneratedCode, deploymentInfo, checkForNewVersion]);

  const handlePublish = async () => {
    if (!projectId) {
      setDeploymentError("Project ID is required for deployment");
      return;
    }
    if (!hasGeneratedCode) {
      setDeploymentError("Please generate code first before publishing");
      return;
    }
    if (deploymentInfo) {
      setShowDeploymentModal(true);
      return;
    }
    await performDeployment();
  };

  const performDeployment = async () => {
    if (!projectId) {
      setDeploymentError("Project ID is required for deployment");
      return;
    }

    const isUpdate = !!deploymentInfo;
    setIsPublishing(!isUpdate);
    setIsUpdating(isUpdate);
    setDeploymentError("");

    try {
      const project = await getProject(projectId);
      const projectName = project?.name || `project-${projectId}`;
      const generatedCode = await getLatestGeneratedCode(projectId);
      if (!generatedCode) {
        throw new Error("No generated code found. Please generate code first.");
      }
      const result = await deployToNetlify(
        generatedCode,
        projectName,
        deploymentInfo ? { siteId: deploymentInfo.siteId, deployId: deploymentInfo.deployId } : undefined
      );
      await saveDeploymentInfo(projectId, {
        url: result.url,
        siteName: result.siteName,
        deployId: result.deployId,
        siteId: result.siteId,
      });
      const newDeploymentInfo = {
        projectId,
        url: result.url,
        siteName: result.siteName,
        deployId: result.deployId,
        siteId: result.siteId,
        deployedAt: new Date() as unknown as DeploymentInfo["deployedAt"],
      };
      setDeploymentInfo(newDeploymentInfo);
      setLastDeployedCode(generatedCode);
      setHasNewVersion(false);
      setShowDeploymentModal(true);
    } catch (error) {
      console.error("Deployment error:", error);
      setDeploymentError(error instanceof Error ? error.message : "Deployment failed");
      setShowDeploymentModal(true);
    } finally {
      setIsPublishing(false);
      setIsUpdating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage("URL copied to clipboard!");
    });
  };

  const downloadProject = async () => {
    if (!projectId) return;

    // Check if user has Go or Pro subscription
    if (subscriptionType === 'free') {
      setToastMessage("Code download is only available for Go and Pro plan users. Upgrade to download!");
      return;
    }

    try {
      const project = await getProject(projectId);
      const html = await getLatestGeneratedCode(projectId);

      if (project && html) {
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${project.name}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setToastMessage("Project downloaded successfully!");
      } else {
        setToastMessage("No generated code found. Please generate code first.");
      }
    } catch (error) {
      console.error("Error downloading project:", error);
      setToastMessage("Failed to download project. Please try again.");
    }
  };

  const sandboxAttributes =
    "allow-downloads allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation allow-top-navigation-by-user-activation allow-top-navigation-to-custom-protocols";

  return (
    <div className="flex flex-col h-full bg-[#18181b] text-white">
      <AnimatePresence>
        {toastMessage && (
          <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
        )}
      </AnimatePresence>
      <header className="flex justify-between items-center p-2 bg-[#18181b] border-b border-[#252529]">
        <div className="flex bg-[#252529] p-1 rounded-lg">
          {Object.keys(devices).map((key) => {
            const deviceKey = key as Device;
            const device = devices[deviceKey];
            const Icon = device.icon;
            return (
              <button
                key={deviceKey}
                onClick={() => handleDeviceChange(deviceKey)}
                className={clsx(
                  "p-1.5 rounded-md transition-all relative",
                  "hover:bg-[#2a2a2e] text-gray-300"
                )}
                title={`${device.label} view`}
                aria-label={`${device.label} view`}
              >
                {selectedDevice === deviceKey && (
                  <motion.div
                    layoutId="device-indicator"
                    className="absolute inset-0 bg-gradient-to-r from-[#5b21b6] to-[#1e40af] rounded-md"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  <Icon size={18} />
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <motion.button
              onClick={downloadProject}
              disabled={!isPremium}
              className={cn(
                "px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium transition-all",
                isPremium
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
              )}
              whileHover={isPremium ? { scale: 1.05 } : {}}
              whileTap={isPremium ? { scale: 0.95 } : {}}
            >
              <Download size={16} />
              <span className="hidden sm:inline">Download</span>
            </motion.button>
            {!isPremium && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Upgrade to Go or Pro to download code
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
              </div>
            )}
          </div>
          <motion.button
            onClick={handlePublish}
            disabled={isPublishing || isUpdating || !hasGeneratedCode}
            className="bg-gradient-to-r from-[#5b21b6] to-[#1e40af] hover:from-[#5b21b6] hover:to-[#1e40af] text-white px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium disabled:opacity-80"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPublishing || isUpdating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{isPublishing ? "Publishing..." : "Updating..."}</span>
              </>
            ) : (
              <>
                <UploadCloud size={16} />
                <span>Publish</span>
              </>
            )}
          </motion.button>
        </div>
      </header>
      {selectedDevice !== "fullscreen" && (
        <div className="flex justify-end items-center p-2">
          <div className="flex items-center space-x-2 bg-[#252529] p-1 rounded-lg">
            <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} disabled={zoom <= 0.5} className="p-1.5 rounded-md hover:bg-gray-800 text-gray-300 transition-colors disabled:opacity-50">
              <Minus size={16} />
            </button>
            <span className="text-sm font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} disabled={zoom >= 2} className="p-1.5 rounded-md hover:bg-gray-800 text-gray-300 transition-colors disabled:opacity-50">
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}
      <main className={clsx("flex-1 overflow-hidden bg-gradient-to-b from-[#18181b] to-[#1c1c20]", selectedDevice !== "fullscreen" ? "p-4" : "p-0")}>
        <motion.div
          className={clsx("transition-transform duration-200 ease-in-out h-full", selectedDevice === "fullscreen" ? "w-full" : "flex justify-center items-center")}
          style={{ transform: `scale(${selectedDevice !== "fullscreen" ? zoom : 1})`, transformOrigin: "center" }}
          layout
        >
          <AnimatePresence mode="wait">
            <motion.div key={selectedDevice} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex justify-center items-center">
              {renderPreview()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>
      <DeploymentModal
        isOpen={showDeploymentModal}
        onClose={() => setShowDeploymentModal(false)}
        deploymentInfo={deploymentInfo}
        deploymentError={deploymentError}
        hasNewVersion={hasNewVersion}
        isUpdating={isUpdating}
        onUpdate={performDeployment}
        onCopyToClipboard={copyToClipboard}
      />
      <style jsx global>{`
        ::-webkit-scrollbar { display: none !important; }
        * { scrollbar-width: none !important; -ms-overflow-style: none !important; }
        iframe { overflow: auto !important; }
      `}</style>
    </div>
  );

  function renderPreview() {
    const props = { isLoading, htmlContent, sandboxAttributes };
    switch (selectedDevice) {
      case "mobile": return <MobilePreview {...props} />;
      case "tablet": return <TabletPreview {...props} />;
      case "laptop": return <LaptopPreview {...props} />;
      case "desktop": return <DesktopPreview {...props} />;
      case "fullscreen": return <FullscreenPreview {...props} />;
      default: return null;
    }
  }
}

// Sub-components
const IframeLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20">
    <Loader2 className="w-8 h-8 text-[#00ccb1] animate-spin" />
  </div>
);

const PreviewFrame = ({ htmlContent, sandboxAttributes }: { htmlContent: string; sandboxAttributes: string }) => {
  const isUrl = htmlContent.startsWith("http");
  return isUrl ? (
    <iframe title="Preview" src={htmlContent} sandbox={sandboxAttributes} className="w-full h-full border-none bg-white" />
  ) : (
    <iframe title="Preview" srcDoc={htmlContent} sandbox={sandboxAttributes} className="w-full h-full border-none bg-white" />
  );
};

const MobilePreview = ({ isLoading, htmlContent, sandboxAttributes }: PreviewComponentProps) => (
  <div className="relative mx-auto border-gray-800 border-[8px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
    {isLoading && <IframeLoader />}
    <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white">
      <PreviewFrame htmlContent={htmlContent} sandboxAttributes={sandboxAttributes} />
    </div>
  </div>
);

const TabletPreview = ({ isLoading, htmlContent, sandboxAttributes }: PreviewComponentProps) => (
  <div className="relative mx-auto border-gray-800 border-[10px] rounded-[1.5rem] h-[700px] w-[500px] shadow-xl">
    {isLoading && <IframeLoader />}
    <div className="rounded-[1rem] overflow-hidden w-full h-full bg-white">
      <PreviewFrame htmlContent={htmlContent} sandboxAttributes={sandboxAttributes} />
    </div>
  </div>
);

const LaptopPreview = ({ isLoading, htmlContent, sandboxAttributes }: PreviewComponentProps) => (
  <div className="relative mx-auto border-gray-800 border-[8px] rounded-t-xl h-[450px] w-[800px] bg-gray-800 shadow-xl">
    <div className="rounded-lg overflow-hidden w-full h-full">
      {isLoading && <IframeLoader />}
      <PreviewFrame htmlContent={htmlContent} sandboxAttributes={sandboxAttributes} />
    </div>
  </div>
);

const DesktopPreview = ({ isLoading, htmlContent, sandboxAttributes }: PreviewComponentProps) => (
  <div className="relative mx-auto border-gray-800 border-[12px] rounded-xl h-[550px] w-[950px] bg-gray-800 shadow-xl">
    <div className="rounded-md overflow-hidden w-full h-full">
      {isLoading && <IframeLoader />}
      <PreviewFrame htmlContent={htmlContent} sandboxAttributes={sandboxAttributes} />
    </div>
  </div>
);

const FullscreenPreview = ({ isLoading, htmlContent, sandboxAttributes }: PreviewComponentProps) => (
  <div className="w-full h-full relative bg-black rounded-lg border border-[#2a2a2e] overflow-hidden">
    {isLoading && <IframeLoader />}
    <PreviewFrame htmlContent={htmlContent} sandboxAttributes={sandboxAttributes} />
  </div>
);

// Deployment Modal Component
const DeploymentModal: React.FC<DeploymentModalProps> = ({
  isOpen,
  onClose,
  deploymentInfo,
  deploymentError,
  hasNewVersion,
  isUpdating,
  onUpdate,
  onCopyToClipboard,
}) => {
    return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md bg-[#252529] border border-[#3a3a3e] rounded-xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{deploymentInfo ? "Deployment Successful" : "Publish Project"}</h3>
                <p className="text-sm text-gray-400">{deploymentInfo ? "Your project is now live on the internet." : "Deploy your project to the web."}</p>
              </div>
              <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#3a3a3e]">
                <X size={18} />
              </button>
            </div>
            {deploymentInfo && !deploymentError && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
                  <CheckCircle size={16} className="text-green-400" />
                  <span className="text-sm text-green-300">Successfully published!</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Live URL</label>
                  <div className="flex items-center gap-2 p-3 bg-[#1e1e22] rounded-lg border border-[#3a3a3e]">
                    <Globe size={16} className="text-blue-400" />
                    <span className="text-sm text-gray-200 flex-1 truncate font-mono">{deploymentInfo.url}</span>
                    <button onClick={() => onCopyToClipboard(deploymentInfo.url)} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#3a3a3e] rounded"><Copy size={14} /></button>
                    <a href={deploymentInfo.url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-white hover:bg-[#3a3a3e] rounded"><ExternalLink size={14} /></a>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">Updates</label>
                    <span className={`text-xs px-2 py-1 rounded-full border ${hasNewVersion ? "bg-orange-500/20 text-orange-300 border-orange-500/30" : "bg-green-500/20 text-green-300 border-green-500/30"}`}>{hasNewVersion ? "New version available" : "Up to date"}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{hasNewVersion ? "You have new changes to publish." : "Your live site is up to date."}</p>
                  <motion.button onClick={onUpdate} disabled={!hasNewVersion || isUpdating} className={clsx("w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all", hasNewVersion ? "bg-gradient-to-r from-[#5b21b6] to-[#1e40af] hover:from-[#6a52e5] hover:to-[#00b3a0] text-white" : "bg-gray-700 text-gray-400 cursor-not-allowed")}>
                    {isUpdating ? <><Loader2 size={16} className="animate-spin inline mr-2" />Updating...</> : "Update Live Site"}
                  </motion.button>
                </div>
              </div>
            )}
            {deploymentError && (
              <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg mt-4 flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-400" />
                <p className="text-sm text-red-300">{deploymentError}</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};