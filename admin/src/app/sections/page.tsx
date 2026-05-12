export default function SectionsPage() {
  return (
    <div className="empty-state-v2">
      <div className="empty-state-content">
        <div className="empty-state-icon">
          <div className="pulse-ring"></div>
          <span className="icon-main">⚡</span>
        </div>
        <h1>Welcome to Kairos Admin</h1>
        <p>Your studio's digital engine. Select a page section from the sidebar to begin refining your content.</p>

        <div className="quick-tips">
          <div className="tip">
            <span className="tip-dot"></span>
            <span>Update pricing and packages instantly</span>
          </div>
          <div className="tip">
            <span className="tip-dot"></span>
            <span>Manage gallery assets with drag & drop</span>
          </div>
          <div className="tip">
            <span className="tip-dot"></span>
            <span>Optimize hero banners for mobile</span>
          </div>
        </div>
      </div>
    </div>
  );
}
