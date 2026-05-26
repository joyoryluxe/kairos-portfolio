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

        <div style={{ marginBottom: '40px' }}>
          <a
            href="https://crm.kairosstudio.in/gallary/kairos-portal-a8f3k/login/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{
              fontSize: '15px',
              padding: '14px 32px',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span>🖼️</span> Go to Gallery
          </a>
        </div>

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
