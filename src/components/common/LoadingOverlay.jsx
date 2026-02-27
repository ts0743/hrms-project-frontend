// Ensure it looks something like this
const LoadingOverlay = ({ text = "Loading..." }) => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-2">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="text-sm font-medium">{text}</p>
    </div>
  </div>
);

export default LoadingOverlay; 