"use client";

import { FadeInUp, ScaleIn } from "../common/animation";
import { useLanguageStore } from "../../stores/useLanguageStore";
import { Typography } from "../common/Typography";
import { Card, CardContent } from "../common/Card";

export function PageView({ titleKey, descKey, children }) {
  const t = useLanguageStore((s) => s.t);

  return (
    <FadeInUp
      className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center"
    >
      <Typography variant="h1" className="text-foreground">
        {t[titleKey]}
      </Typography>
      <Typography variant="p" className="max-w-2xl text-foreground/80">
        {t[descKey]}
      </Typography>
      <ScaleIn
        delay={0.15}
        className="mt-8 w-full max-w-4xl"
      >
        <Card className="w-full bg-card/50 p-6">
          <CardContent className="flex min-h-[300px] items-center justify-center p-6">
            {children ?? (
              <Typography variant="h3" className="text-foreground/40">
                {t[titleKey]} Component Placeholder
              </Typography>
            )}
          </CardContent>
        </Card>
      </ScaleIn>
    </FadeInUp>
  );
}
