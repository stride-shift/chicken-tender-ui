interface PixelStripProps {
  colors?: string[];
  segments?: number;
}

export const PixelStrip = (_props: PixelStripProps) => (
  <div className="h-[1px] w-full bg-border" />
);
