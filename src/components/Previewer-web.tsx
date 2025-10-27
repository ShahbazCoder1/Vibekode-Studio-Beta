"use client";

import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import clsx from "clsx";
import { deployToNetlify } from "@/backend/deploy";
import {
  saveDeploymentInfo,
  getDeploymentInfo,
  DeploymentInfo,
  getProject,
  getLatestGeneratedCode,
} from "@/lib/firebase";

// Define the types for our component props
interface PreviewerProps {
  projectId?: string;
  hasGeneratedCode?: boolean; // Add flag to track if code has been generated
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

export default function Previewer({
  projectId,
  hasGeneratedCode = false,
}: PreviewerProps) {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [selectedDevice, setSelectedDevice] = useState<Device>("fullscreen");
  const [zoom, setZoom] = useState<number>(0.9);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deploymentInfo, setDeploymentInfo] = useState<DeploymentInfo | null>(
    null
  );
  const [showDeploymentModal, setShowDeploymentModal] = useState(false);
  const [deploymentError, setDeploymentError] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [hasNewVersion, setHasNewVersion] = useState<boolean>(false);
  const [lastDeployedCode, setLastDeployedCode] = useState<string>("");

  const contentRef = useRef<string>(htmlContent);

  useEffect(() => {
    // Use URL instead of inline HTML for default loading screen
    const defaultConsoleHTML = "https://preview.vibekode.studio/";

    // Only use preview URL if we have both projectId AND code has been generated
    const codeToRender =
      projectId && hasGeneratedCode
        ? `https://preview.vibekode.studio/preview/${projectId}?token=${process.env.NEXT_PUBLIC_PREVIEW_TOKEN}`
        : defaultConsoleHTML;

    setHtmlContent(codeToRender);
    contentRef.current = codeToRender;
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [projectId, hasGeneratedCode]);

  const handleDeviceChange = (device: Device) => {
    setSelectedDevice(device);
    setIsLoading(true);
    setHtmlContent(contentRef.current);
    setTimeout(() => setIsLoading(false), 500);
  };

  // Load deployment info when component mounts
  useEffect(() => {
    if (projectId) {
      loadDeploymentInfo();
    }
  }, [projectId]);

  const loadDeploymentInfo = async () => {
    if (!projectId) return;

    try {
      const info = await getDeploymentInfo(projectId);
      setDeploymentInfo(info);
    } catch (error) {
      console.error("Error loading deployment info:", error);
    }
  };

  // Check for new version when code is generated
  useEffect(() => {
    if (projectId && hasGeneratedCode && deploymentInfo) {
      checkForNewVersion();
    }
  }, [projectId, hasGeneratedCode, deploymentInfo]);

  const checkForNewVersion = async () => {
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
  };

  const handlePublish = async () => {
    if (!projectId) {
      setDeploymentError("Project ID is required for deployment");
      return;
    }

    // Check if we have generated code
    if (!hasGeneratedCode) {
      setDeploymentError("Please generate code first before publishing");
      return;
    }

    // If deployment exists, show popup instead of deploying directly
    if (deploymentInfo) {
      setShowDeploymentModal(true);
      return;
    }

    // First time publish - deploy directly
    await performDeployment();
  };

  const handleUpdateDeployment = async () => {
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
      // Get project details for site naming
      const project = await getProject(projectId);
      const projectName = project?.name || `project-${projectId}`;

      // Get the latest generated code from Firebase
      const generatedCode = await getLatestGeneratedCode(projectId);

      if (!generatedCode) {
        throw new Error("No generated code found. Please generate code first.");
      }

      console.log("Found generated code, length:", generatedCode.length);

      // Deploy to Netlify (new deployment or update)
      const result = await deployToNetlify(
        generatedCode,
        projectName,
        deploymentInfo
          ? {
              siteId: deploymentInfo.siteId,
              deployId: deploymentInfo.deployId,
            }
          : undefined
      );

      // Save/update deployment info to Firebase
      await saveDeploymentInfo(projectId, {
        url: result.url,
        siteName: result.siteName,
        deployId: result.deployId,
        siteId: result.siteId,
      });

      // Update local state
      setDeploymentInfo({
        projectId,
        url: result.url,
        siteName: result.siteName,
        deployId: result.deployId,
        siteId: result.siteId,
        deployedAt: new Date() as unknown as DeploymentInfo["deployedAt"],
      });

      // Update last deployed code
      setLastDeployedCode(generatedCode);
      setHasNewVersion(false);

      // Show success popup for updates, or automatically show for first publish
      setShowDeploymentModal(true);
    } catch (error) {
      console.error("Deployment error:", error);
      setDeploymentError(
        error instanceof Error ? error.message : "Deployment failed"
      );
      setShowDeploymentModal(true); // Show modal even on error to display the error
    } finally {
      setIsPublishing(false);
      setIsUpdating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show success feedback (you could add a toast here)
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const sandboxAttributes =
    "allow-downloads allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation allow-top-navigation-by-user-activation allow-top-navigation-to-custom-protocols";

  return (
    <div className="flex flex-col h-full bg-[#18181b] text-white">
      {/* HEADER: Redesigned for better alignment and compact buttons */}
      <header className="flex justify-between items-center p-2 bg-[#18181b] border-b border-[#252529]">
        {/* Device Selection Group (Left Aligned) */}
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
                  "p-1.5 rounded-md transition-all", // Reduced padding
                  selectedDevice === deviceKey
                    ? "bg-gradient-to-r from-[#7b61ff] to-[#00ccb1] text-white"
                    : "hover:bg-[#2a2a2e] text-gray-300"
                )}
                title={`${device.label} view`}
                aria-label={`${device.label} view`}
              >
                <Icon size={18} /> {/* Reduced icon size */}
              </button>
            );
          })}
        </div>

        {/* Action Buttons Group (Right Aligned) */}
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <button
              disabled
              className="bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium opacity-70 cursor-not-allowed" // Reduced padding
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Download size={16} /> {/* Reduced icon size */}
              <span className="hidden sm:inline">Download</span>
            </button>
            {showTooltip && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-50">
                Coming soon...
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45" />
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={handlePublish}
              disabled={isPublishing || isUpdating || !hasGeneratedCode}
              className="bg-gradient-to-r from-[#7b61ff] to-[#00ccb1] hover:from-[#6a52e5] hover:to-[#00b3a0] text-white px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium disabled:opacity-80"
            >
              {isPublishing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span className="hidden sm:inline">Publishing...</span>
                </>
              ) : isUpdating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span className="hidden sm:inline">Updating...</span>
                </>
              ) : (
                <>
                  <UploadCloud size={16} />
                  <span className="hidden sm:inline">
                    {deploymentInfo ? "Publish" : "Publish"}
                  </span>
                </>
              )}
            </button>

            {/* Enhanced Deployment Popup */}
            {showDeploymentModal && (
              // Overlay and responsive container for the modal
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowDeploymentModal(false)}
              >
                {/* Modal content - made responsive and cleaner */}
                <div
                  className="relative w-full max-w-sm sm:max-w-md bg-[#252529] border border-[#3a3a3e] rounded-xl p-5 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header with title and close button */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {deploymentInfo ? "Live on Internet" : "Publishing..."}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {deploymentInfo
                          ? "Your project is live"
                          : "Deploying your project..."}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDeploymentModal(false)}
                      className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#3a3a3e]"
                      aria-label="Close deployment status"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Content for successful deployment */}
                  {deploymentInfo && (
                    <div className="flex flex-col gap-4">
                      {/* Simplified success message */}
                      <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
                        <CheckCircle size={16} className="text-green-400" />
                        <span className="text-sm text-green-300">
                          Successfully published to the internet!
                        </span>
                      </div>

                      {/* Live URL section with combined actions */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Live URL
                        </label>
                        <div className="flex items-center gap-2 p-3 bg-[#1e1e22] rounded-lg border border-[#3a3a3e]">
                          <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                            <Globe size={12} className="text-white" />
                          </div>
                          <span className="text-sm text-gray-200 flex-1 truncate font-mono">
                            {deploymentInfo.url.replace("https://", "")}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                copyToClipboard(deploymentInfo.url)
                              }
                              className="p-1.5 text-gray-400 hover:text-white transition-colors hover:bg-[#3a3a3e] rounded"
                              title="Copy URL"
                            >
                              <Copy size={14} />
                            </button>
                            <a
                              href={deploymentInfo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-gray-400 hover:text-white transition-colors hover:bg-[#3a3a3e] rounded"
                              title="Visit Site"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Update section with consolidated status */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-300">
                            Updates
                          </label>
                          {hasNewVersion ? (
                            <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full border border-orange-500/30">
                              New version available
                            </span>
                          ) : (
                            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30">
                              Up to date
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mb-3">
                          {hasNewVersion
                            ? "You have made changes to your code. Click update to publish the latest version."
                            : "Your live site is showing the latest version of your code."}
                        </p>

                        <button
                          onClick={handleUpdateDeployment}
                          disabled={!hasNewVersion || isUpdating}
                          className={clsx(
                            "w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
                            hasNewVersion
                              ? "bg-gradient-to-r from-[#7b61ff] to-[#00ccb1] hover:from-[#6a52e5] hover:to-[#00b3a0] text-white"
                              : "bg-gray-700 text-gray-400 cursor-not-allowed"
                          )}
                        >
                          {isUpdating ? (
                            <>
                              <Loader2
                                size={16}
                                className="animate-spin inline mr-2"
                              />
                              Updating...
                            </>
                          ) : (
                            `Update Live Site${
                              hasNewVersion ? "" : " (No changes)"
                            }`
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Deployment Error message */}
                  {deploymentError && (
                    <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg mt-4">
                      <div className="flex items-center gap-2 mb-1">
                        <X size={16} className="text-red-400" />
                        <span className="text-sm font-medium text-red-300">
                          Deployment Failed
                        </span>
                      </div>
                      <p className="text-xs text-red-400">{deploymentError}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Zoom Controls */}
      {selectedDevice !== "fullscreen" && (
        <div className="flex justify-end items-center p-2">
          <div className="flex items-center space-x-2 bg-[#252529] p-1 rounded-lg">
            <button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              className="p-1.5 rounded-md hover:bg-gray-800 text-gray-300 transition-colors disabled:opacity-50"
              disabled={zoom <= 0.5}
              title="Zoom out"
            >
              <Minus size={16} />
            </button>
            <span className="text-sm font-medium w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              className="p-1.5 rounded-md hover:bg-gray-800 text-gray-300 transition-colors disabled:opacity-50"
              disabled={zoom >= 2}
              title="Zoom in"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Preview Area */}
      <main
        className={clsx(
          "flex-1 overflow-hidden bg-gradient-to-b from-[#18181b] to-[#1c1c20]",
          selectedDevice !== "fullscreen" ? "p-4" : "p-0"
        )}
      >
        <div
          className={clsx(
            "transition-transform duration-200 ease-in-out h-full", // Ensures div takes full height of main
            selectedDevice === "fullscreen"
              ? "w-full"
              : "flex justify-center items-center" // Vertically centers the content
          )}
          style={{
            transform: `scale(${selectedDevice !== "fullscreen" ? zoom : 1})`,
            transformOrigin: "center",
          }}
        >
          {/* Dynamically render the correct preview component */}
          {selectedDevice === "mobile" && (
            <MobilePreview
              isLoading={isLoading}
              htmlContent={htmlContent}
              sandboxAttributes={sandboxAttributes}
            />
          )}
          {selectedDevice === "tablet" && (
            <TabletPreview
              isLoading={isLoading}
              htmlContent={htmlContent}
              sandboxAttributes={sandboxAttributes}
            />
          )}
          {selectedDevice === "laptop" && (
            <LaptopPreview
              isLoading={isLoading}
              htmlContent={htmlContent}
              sandboxAttributes={sandboxAttributes}
            />
          )}
          {selectedDevice === "desktop" && (
            <DesktopPreview
              isLoading={isLoading}
              htmlContent={htmlContent}
              sandboxAttributes={sandboxAttributes}
            />
          )}
          {selectedDevice === "fullscreen" && (
            <FullscreenPreview
              isLoading={isLoading}
              htmlContent={htmlContent}
              sandboxAttributes={sandboxAttributes}
            />
          )}
        </div>
      </main>

      {/* Global Styles */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          display: none !important;
        }
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        iframe {
          overflow: auto !important;
        }
      `}</style>
    </div>
  );
}

// Sub-components for cleaner rendering
interface PreviewComponentProps {
  isLoading: boolean;
  htmlContent: string;
  sandboxAttributes: string;
}

const IframeLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20">
    <Loader2 className="w-8 h-8 text-[#00ccb1] animate-spin" />
  </div>
);

const PreviewFrame = ({
  htmlContent,
  sandboxAttributes,
}: Omit<PreviewComponentProps, "isLoading">) => {
  // Check if htmlContent is a URL
  const isUrl =
    htmlContent.startsWith("http://") || htmlContent.startsWith("https://");

  return isUrl ? (
    <iframe
      title="HTML Preview"
      src={htmlContent}
      sandbox={sandboxAttributes}
      className="w-full h-full overflow-auto border-none bg-white"
      style={{ WebkitOverflowScrolling: "touch" }}
    />
  ) : (
    <iframe
      title="HTML Preview"
      srcDoc={htmlContent}
      sandbox={sandboxAttributes}
      className="w-full h-full overflow-auto border-none bg-white"
      style={{ WebkitOverflowScrolling: "touch" }}
    />
  );
};

const MobilePreview = ({
  isLoading,
  htmlContent,
  sandboxAttributes,
}: PreviewComponentProps) => (
  <div className="relative mx-auto border-[#2a2a2e] border-[8px] rounded-[2rem] h-[640px] w-[320px] shadow-xl overflow-hidden bg-black flex-shrink-0">
    <div className="absolute top-0 inset-x-0 h-5 w-32 mx-auto bg-[#2a2a2e] rounded-b-xl z-10" />
    {isLoading && <IframeLoader />}
    <PreviewFrame
      htmlContent={htmlContent}
      sandboxAttributes={sandboxAttributes}
    />
  </div>
);

const TabletPreview = ({
  isLoading,
  htmlContent,
  sandboxAttributes,
}: PreviewComponentProps) => (
  <div className="relative mx-auto border-[#2a2a2e] border-[10px] rounded-[1.2rem] h-[700px] w-[500px] shadow-xl overflow-hidden bg-black flex-shrink-0">
    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 h-2 w-2 bg-[#444] rounded-full z-10" />
    {isLoading && <IframeLoader />}
    <PreviewFrame
      htmlContent={htmlContent}
      sandboxAttributes={sandboxAttributes}
    />
  </div>
);

const LaptopPreview = ({
  isLoading,
  htmlContent,
  sandboxAttributes,
}: PreviewComponentProps) => (
  <div className="relative mx-auto shadow-xl flex-shrink-0">
    <div className="relative border-[#2a2a2e] border-[12px] rounded-t-xl h-[450px] w-[800px] bg-black overflow-hidden">
      <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 h-2 w-2 bg-[#444] rounded-full z-10" />
      {isLoading && <IframeLoader />}
      <PreviewFrame
        htmlContent={htmlContent}
        sandboxAttributes={sandboxAttributes}
      />
    </div>
    <div className="relative bg-gradient-to-b from-[#2a2a2e] to-[#1e1e22] rounded-b-lg h-[30px] w-[800px]">
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-[10px] bg-[#444] rounded-sm opacity-30" />
    </div>
  </div>
);

const DesktopPreview = ({
  isLoading,
  htmlContent,
  sandboxAttributes,
}: PreviewComponentProps) => (
  <div className="relative mx-auto bg-[#2a2a2e] p-2 sm:p-3 rounded-xl shadow-xl w-full max-w-[1000px] flex-shrink-0">
    <div className="bg-[#1e1e22] flex items-center gap-2 px-3 py-1.5 rounded-t-lg">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
        <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
        <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
      </div>
    </div>
    <div className="h-[500px] bg-black rounded-b-lg overflow-hidden relative">
      {isLoading && <IframeLoader />}
      <PreviewFrame
        htmlContent={htmlContent}
        sandboxAttributes={sandboxAttributes}
      />
    </div>
  </div>
);

const FullscreenPreview = ({
  isLoading,
  htmlContent,
  sandboxAttributes,
}: PreviewComponentProps) => (
  <div className="w-full h-full relative bg-black rounded-lg border border-[#2a2a2e] overflow-hidden">
    {isLoading && <IframeLoader />}
    <PreviewFrame
      htmlContent={htmlContent}
      sandboxAttributes={sandboxAttributes}
    />
  </div>
);
