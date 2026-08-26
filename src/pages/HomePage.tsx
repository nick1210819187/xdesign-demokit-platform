const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export function HomePage() {
  return (
    <div className="foc-home-preview">
      <img
        src={assetPath('/assets/home/foc-home-base.png')}
        alt="FusionOne Center 首页视觉预览"
        draggable={false}
      />
    </div>
  );
}
