type BrandLogoProps = { loading?: "eager" | "lazy" };

export default function BrandLogo({ loading = "eager" }: BrandLogoProps) {
  return (
    <span className="brand-logo" aria-label="SNC">
      <span className="brand-logo-type">SNC</span>
      <span className="brand-logo-caption">INDEPENDENT BY DESIGN</span>
    </span>
  );
}