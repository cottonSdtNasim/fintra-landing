/* Named Colors */
const TEA_GREEN_COLOR = "#D3FECD";
const MINDARO_GREEN_COLOR = "#C3FE84";
const GREEN_YELLOW_COLOR = "#B7FF64"; // Fintra Green
const CELADON_GREEN_COLOR = "#96d8b4";
const DARK_SLATE_GREEN_COLOR = "#163A3B";
const GUNMETAL_GREEN_COLOR = "#1B867F"; // UI Green
const RICH_GREEN_COLOR = "#061D1D";

const POWER_BLUSH_RED_COLOR = "#FFAEAE";
const CINNABAR_RED_COLOR = "#FF2C2C";

const WHITE_COLOR = "#FFFFFF";
const BLACK_COLOR = "#000000";
const GHOST_WHITE_COLOR = "#EAEBF4";

/* UI Colors */
const FINTRA_GREEN_COLOR = GREEN_YELLOW_COLOR;  // #B7FF64
const UP_COLOR = GREEN_YELLOW_COLOR; // #B7FF64
const DOWN_COLOR = CINNABAR_RED_COLOR; // #FF2C2C

/* Advanced Chart Specific Colors */
const DARK_GREEN_BACKGROUND_COLOR = "#0D1818";
const GRID_LINES_COLOR = "#1A2A2A";
const WHITE_TEXT_COLOR = GHOST_WHITE_COLOR; // #EAEBF4
const PRIMARY_LINE_COLOR = CELADON_GREEN_COLOR; // #96d8b4
const PRIMARY_FILL_COLOR = DARK_SLATE_GREEN_COLOR; // #163A3B
const SECONDARY_LINE_COLOR = CELADON_GREEN_COLOR; // #FFAEAE
const SECONDARY_FILL_COLOR = CELADON_GREEN_COLOR; // #FFAEAE

export const defaultOverrides = {
  /* Chart background */
  "paneProperties.background": DARK_GREEN_BACKGROUND_COLOR,
  "paneProperties.backgroundType": "solid",

  /* Grid */
  "paneProperties.vertGridProperties.color": GRID_LINES_COLOR,
  "paneProperties.horzGridProperties.color": GRID_LINES_COLOR,

  /* Crosshair */
  "paneProperties.crossHairProperties.color": CELADON_GREEN_COLOR,
  "paneProperties.crossHairProperties.width": 1,

  /* Price scale & time scale */
  "scalesProperties.textColor": WHITE_TEXT_COLOR,
  "scalesProperties.lineColor": DARK_SLATE_GREEN_COLOR,

  /* Candles */
  "mainSeriesProperties.candleStyle.upColor": UP_COLOR,
  "mainSeriesProperties.candleStyle.downColor": DOWN_COLOR,

  "mainSeriesProperties.candleStyle.borderUpColor": UP_COLOR,
  "mainSeriesProperties.candleStyle.borderDownColor": DOWN_COLOR,

  "mainSeriesProperties.candleStyle.wickUpColor": UP_COLOR,
  "mainSeriesProperties.candleStyle.wickDownColor": DOWN_COLOR,

  "mainSeriesProperties.candleStyle.drawBorder": true,
  "mainSeriesProperties.candleStyle.drawWick": true,

  /* Hollow Candles */
  "mainSeriesProperties.hollowCandleStyle.upColor": UP_COLOR,
  "mainSeriesProperties.hollowCandleStyle.downColor": DOWN_COLOR,

  /* Heikin Ashi */
  "mainSeriesProperties.haStyle.upColor": UP_COLOR,
  "mainSeriesProperties.haStyle.downColor": DOWN_COLOR,

  /* Bars */
  "mainSeriesProperties.barStyle.upColor": UP_COLOR,
  "mainSeriesProperties.barStyle.downColor": DOWN_COLOR,

  /* Area chart */
  "mainSeriesProperties.areaStyle.color1": "rgba(183,255,100,0.35)",
  "mainSeriesProperties.areaStyle.color2": "rgba(183,255,100,0.05)",
  "mainSeriesProperties.areaStyle.linecolor": UP_COLOR,

  /* Line chart */
  "mainSeriesProperties.lineStyle.color": UP_COLOR,

  /* Baseline chart */
  "mainSeriesProperties.baselineStyle.topFillColor1": "rgba(183,255,100,0.35)",
  "mainSeriesProperties.baselineStyle.topFillColor2": "rgba(183,255,100,0.05)",
  "mainSeriesProperties.baselineStyle.bottomFillColor1": "rgba(255,44,44,0.25)",
  "mainSeriesProperties.baselineStyle.bottomFillColor2": "rgba(255,44,44,0.05)",
  "mainSeriesProperties.baselineStyle.topLineColor": UP_COLOR,
  "mainSeriesProperties.baselineStyle.bottomLineColor": DOWN_COLOR,
};

export const defaultStudiesOverrides = {
  /* Volume Bars */
  "volume.volume.color.0": DOWN_COLOR,  // bearish bars
  "volume.volume.color.1": UP_COLOR,    // bullish bars

  // /* Moving averages */
  // "moving average.plot.color": CELADON_GREEN_COLOR,

  // /* Bollinger */
  // "bollinger bands.upper.color": CELADON_GREEN_COLOR,
  // "bollinger bands.lower.color": CELADON_GREEN_COLOR,

  // /* RSI */
  // "relative strength index.plot.color": CELADON_GREEN_COLOR,
  // "relative strength index.hlines background.color": "#142222",

  // /* MACD */
  // "macd.macd.color": CELADON_GREEN_COLOR,
  // "macd.signal.color": "#FFD166",
  // "macd.histogram.color": "#FFFFFF"
}

export const defaultToolsOverrides = {

  // ============================================================
  // LINES & RAYS
  // ============================================================

  /* Trend Line */
  "linetooltrendline.linecolor": PRIMARY_LINE_COLOR,
  "linetooltrendline.textcolor": WHITE_TEXT_COLOR,

  /* Ray */
  "linetoolray.linecolor": PRIMARY_LINE_COLOR,
  "linetoolray.textcolor": WHITE_TEXT_COLOR,

  /* Info Line (Price Range) */
  "linetoolinfoline.linecolor": PRIMARY_LINE_COLOR,
  "linetoolinfoline.textcolor": WHITE_TEXT_COLOR,
  "linetoolinfoline.backgroundColor": PRIMARY_FILL_COLOR,

  /* Extended Line */
  "linetoolextended.linecolor": PRIMARY_LINE_COLOR,
  "linetoolextended.textcolor": WHITE_TEXT_COLOR,

  /* Trend Angle */
  "linetooltrendangle.linecolor": PRIMARY_LINE_COLOR,
  "linetooltrendangle.textcolor": WHITE_TEXT_COLOR,

  /* Horizontal Line */
  "linetoolhorzline.linecolor": PRIMARY_LINE_COLOR,
  "linetoolhorzline.textcolor": WHITE_TEXT_COLOR,

  /* Horizontal Ray */
  "linetoolhorzray.linecolor": PRIMARY_LINE_COLOR,
  "linetoolhorzray.textcolor": WHITE_TEXT_COLOR,

  /* Vertical Line */
  "linetoolvertline.linecolor": PRIMARY_LINE_COLOR,
  "linetoolvertline.textcolor": WHITE_TEXT_COLOR,

  /* Cross Line */
  "linetoolcrossline.linecolor": PRIMARY_LINE_COLOR,
  "linetoolcrossline.textcolor": WHITE_TEXT_COLOR,

  // ============================================================
  // CHANNELS
  // ============================================================

  /* Parallel Channel */
  

  /* Regression Trend */
  "linetoolregressiontrend.styles.baseLine.color" : PRIMARY_LINE_COLOR,
  "linetoolregressiontrend.styles.downLine.color": PRIMARY_LINE_COLOR,
  "linetoolregressiontrend.styles.upLine.color": PRIMARY_LINE_COLOR,

  /* Disjoint Angle */
  "linetooldisjointangle.linecolor": PRIMARY_LINE_COLOR,
  "linetooldisjointangle.fillBackground": true,
  "linetooldisjointangle.backgroundColor": PRIMARY_FILL_COLOR,

  /* Flat Top / Bottom */
  "linetoolflattop.linecolor": PRIMARY_LINE_COLOR,
  "linetoolflattop.fillBackground": true,
  "linetoolflattop.backgroundColor": PRIMARY_FILL_COLOR,
  "linetoolflattop.textcolor": WHITE_TEXT_COLOR,

  // ============================================================
  // FIBONACCI TOOLS
  // ============================================================

  /* Fibonacci Retracement */
  "linetoolfibretracement.linecolor": PRIMARY_LINE_COLOR,
  "linetoolfibretracement.textcolor": WHITE_TEXT_COLOR,
  // Retracement levels — kept as-is
  "linetoolfibretracement.level0.color": "#e8f3f2",   // 0
  "linetoolfibretracement.level1.color": "#d1e7e5",   // 0.236
  "linetoolfibretracement.level2.color": "#bbdbd9",   // 0.382
  "linetoolfibretracement.level3.color": "#a4cfcc",   // 0.5
  "linetoolfibretracement.level4.color": "#8dc3bf",   // 0.618
  "linetoolfibretracement.level5.color": "#76b6b2",   // 0.786
  "linetoolfibretracement.level6.color": "#5faaa5",   // 1.0
  "linetoolfibretracement.level7.color": "#499e99",   // 1.618
  "linetoolfibretracement.level8.color": "#32928c",   // 2.618
  "linetoolfibretracement.level9.color": "#1b867f",   // 3.618
  "linetoolfibretracement.level10.color": "#187972",  // 4.236

  /* Fibonacci Fan (Fib Bands) */
  "linetoolfibbands.linecolor": PRIMARY_LINE_COLOR,
  "linetoolfibbands.textcolor": WHITE_TEXT_COLOR,
  // Levels — kept as-is
  "linetoolfibbands.level0.color": "#e8f3f2",         // 0.236
  "linetoolfibbands.level1.color": "#bbdbd9",         // 0.382
  "linetoolfibbands.level2.color": "#8dc3bf",         // 0.5
  "linetoolfibbands.level3.color": "#5faaa5",         // 0.618
  "linetoolfibbands.level4.color": "#1b867f",         // 0.786

  /* Fibonacci Arc */
  "linetoolfibarc.linecolor": PRIMARY_LINE_COLOR,
  "linetoolfibarc.textcolor": WHITE_TEXT_COLOR,
  // Levels — kept as-is
  "linetoolfibarc.level0.color": "#e8f3f2",           // 0.236
  "linetoolfibarc.level1.color": "#bbdbd9",           // 0.382
  "linetoolfibarc.level2.color": "#8dc3bf",           // 0.5
  "linetoolfibarc.level3.color": "#5faaa5",           // 0.618
  "linetoolfibarc.level4.color": "#1b867f",           // 0.786

  /* Fibonacci Time Zone */
  "linetoolfibtimezone.linecolor": PRIMARY_LINE_COLOR,
  "linetoolfibtimezone.textcolor": WHITE_TEXT_COLOR,
  // Levels — kept as-is
  "linetoolfibtimezone.level0.color": "#e8f3f2",
  "linetoolfibtimezone.level1.color": "#d1e7e5",
  "linetoolfibtimezone.level2.color": "#bbdbd9",
  "linetoolfibtimezone.level3.color": "#a4cfcc",
  "linetoolfibtimezone.level4.color": "#8dc3bf",
  "linetoolfibtimezone.level5.color": "#76b6b2",
  "linetoolfibtimezone.level6.color": "#5faaa5",
  "linetoolfibtimezone.level7.color": "#499e99",
  "linetoolfibtimezone.level8.color": "#32928c",
  "linetoolfibtimezone.level9.color": "#1b867f",

  /* Fibonacci Channel */
  "linetoolFibChannel.linecolor": PRIMARY_LINE_COLOR,
  "linetoolFibChannel.textcolor": WHITE_TEXT_COLOR,
  // Levels — kept as-is
  "linetoolFibChannel.level0.color": "#e8f3f2",
  "linetoolFibChannel.level1.color": "#d1e7e5",
  "linetoolFibChannel.level2.color": "#bbdbd9",
  "linetoolFibChannel.level3.color": "#a4cfcc",
  "linetoolFibChannel.level4.color": "#8dc3bf",
  "linetoolFibChannel.level5.color": "#76b6b2",
  "linetoolFibChannel.level6.color": "#5faaa5",
  "linetoolFibChannel.level7.color": "#499e99",
  "linetoolFibChannel.level8.color": "#32928c",
  "linetoolFibChannel.level9.color": "#1b867f",
  "linetoolFibChannel.level10.color": "#187972",

  /* Fibonacci Circles */
  "linetoolFibCircles.linecolor": PRIMARY_LINE_COLOR,
  "linetoolFibCircles.textcolor": WHITE_TEXT_COLOR,

  /* Fibonacci Speed Resistance Arcs */
  "linetoolFibSpeedResistanceArcs.linecolor": PRIMARY_LINE_COLOR,
  "linetoolFibSpeedResistanceArcs.textcolor": WHITE_TEXT_COLOR,

  /* Fibonacci Speed Resistance Fan */
  "linetoolFibSpeedResistanceFan.linecolor": PRIMARY_LINE_COLOR,
  "linetoolFibSpeedResistanceFan.textcolor": WHITE_TEXT_COLOR,

  /* Fibonacci Wedge */
  "linetoolfibwedge.linecolor": PRIMARY_LINE_COLOR,
  "linetoolfibwedge.textcolor": WHITE_TEXT_COLOR,


  // ============================================================
  // GANN TOOLS
  // ============================================================

  /* Gann Fan */
  "linetoolGannFan.linecolor": PRIMARY_LINE_COLOR,
  "linetoolGannFan.textcolor": WHITE_TEXT_COLOR,

  /* Gann Square */
  "linetoolgannSquare.linecolor": PRIMARY_LINE_COLOR,
  "linetoolgannSquare.fillBackground": true,
  "linetoolgannSquare.backgroundColor": PRIMARY_FILL_COLOR,
  "linetoolgannSquare.textcolor": WHITE_TEXT_COLOR,

  /* Gann Complex */
  "linetoolgannComplex.linecolor": PRIMARY_LINE_COLOR,
  "linetoolgannComplex.fillBackground": true,
  "linetoolgannComplex.backgroundColor": PRIMARY_FILL_COLOR,
  "linetoolgannComplex.textcolor": WHITE_TEXT_COLOR,

  /* Gann Fixed */
  "linetoolgannfixed.linecolor": PRIMARY_LINE_COLOR,
  "linetoolgannfixed.textcolor": WHITE_TEXT_COLOR,


  // ============================================================
  // PITCHFORKS
  // ============================================================

  /* Pitchfork */
  "linetoolpitchfork.linecolor": PRIMARY_LINE_COLOR,
  "linetoolpitchfork.fillBackground": true,
  "linetoolpitchfork.backgroundColor": PRIMARY_FILL_COLOR,
  "linetoolpitchfork.textcolor": WHITE_TEXT_COLOR,

  /* Schiff Pitchfork */
  "linetoolschiffpitchfork.linecolor": PRIMARY_LINE_COLOR,
  "linetoolschiffpitchfork.fillBackground": true,
  "linetoolschiffpitchfork.backgroundColor": PRIMARY_FILL_COLOR,
  "linetoolschiffpitchfork.textcolor": WHITE_TEXT_COLOR,

  /* Modified Schiff Pitchfork */
  "linetoolmodifiedschiffpitchfork.linecolor": PRIMARY_LINE_COLOR,
  "linetoolmodifiedschiffpitchfork.fillBackground": true,
  "linetoolmodifiedschiffpitchfork.backgroundColor": PRIMARY_FILL_COLOR,
  "linetoolmodifiedschiffpitchfork.textcolor": WHITE_TEXT_COLOR,

  /* Inside Pitchfork */
  "linetoolinsidepitchfork.linecolor": PRIMARY_LINE_COLOR,
  "linetoolinsidepitchfork.fillBackground": true,
  "linetoolinsidepitchfork.backgroundColor": PRIMARY_FILL_COLOR,
  "linetoolinsidepitchfork.textcolor": WHITE_TEXT_COLOR,


  // ============================================================
  // ELLIOTT WAVE
  // ============================================================

  /* Elliott Impulse Wave (12345) */
  "linetoolElliott12345.linecolor": PRIMARY_LINE_COLOR,
  "linetoolElliott12345.textcolor": WHITE_TEXT_COLOR,

  /* Elliott Correction Wave (ABC) */
  "linetoolElliottABC.linecolor": PRIMARY_LINE_COLOR,
  "linetoolElliottABC.textcolor": WHITE_TEXT_COLOR,

  /* Elliott Triangle Wave (ABCDE) */
  "linetoolElliottABCDE.linecolor": PRIMARY_LINE_COLOR,
  "linetoolElliottABCDE.textcolor": WHITE_TEXT_COLOR,

  /* Elliott Double Combo (WXY) */
  "linetoolElliottWXY.linecolor": PRIMARY_LINE_COLOR,
  "linetoolElliottWXY.textcolor": WHITE_TEXT_COLOR,

  /* Elliott Triple Combo (WXYXZ) */
  "linetoolElliottWXYXZ.linecolor": PRIMARY_LINE_COLOR,
  "linetoolElliottWXYXZ.textcolor": WHITE_TEXT_COLOR,


  // ============================================================
  // HARMONIC PATTERNS
  // ============================================================

  /* ABCD Pattern */
  "linetoolABCD.linecolor": PRIMARY_LINE_COLOR,
  "linetoolABCD.textcolor": WHITE_TEXT_COLOR,
  "linetoolABCD.backgroundColor": PRIMARY_FILL_COLOR,

  /* Three Drives */
  "linetoolthreedrives.linecolor": PRIMARY_LINE_COLOR,
  "linetoolthreedrives.textcolor": WHITE_TEXT_COLOR,
  "linetoolthreedrives.backgroundColor": PRIMARY_FILL_COLOR,

  /* Cypher Pattern */
  "linetoolcypherpattern.linecolor": PRIMARY_LINE_COLOR,
  "linetoolcypherpattern.textcolor": WHITE_TEXT_COLOR,
  "linetoolcypherpattern.backgroundColor": PRIMARY_FILL_COLOR,

  /* Five Points Pattern (Gartley / Butterfly) */
  "linetoolfivepointspattern.linecolor": PRIMARY_LINE_COLOR,
  "linetoolfivepointspattern.textcolor": WHITE_TEXT_COLOR,
  "linetoolfivepointspattern.backgroundColor": PRIMARY_FILL_COLOR,


  // ============================================================
  // SHAPES
  // ============================================================

  /* Rectangle */
  "linetoolrectangle.linecolor": PRIMARY_LINE_COLOR,
  "linetoolrectangle.fillBackground": true,
  "linetoolrectangle.backgroundColor": PRIMARY_FILL_COLOR,

  /* Rotated Rectangle */
  "linetoolrotatedrectangle.linecolor": PRIMARY_LINE_COLOR,
  "linetoolrotatedrectangle.fillBackground": true,
  "linetoolrotatedrectangle.backgroundColor": PRIMARY_FILL_COLOR,

  /* Ellipse */
  "linetoolellipse.linecolor": PRIMARY_LINE_COLOR,
  "linetoolellipse.fillBackground": true,
  "linetoolellipse.backgroundColor": PRIMARY_FILL_COLOR,

  /* Circle */
  "linetoolcircle.linecolor": PRIMARY_LINE_COLOR,
  "linetoolcircle.fillBackground": true,
  "linetoolcircle.backgroundColor": PRIMARY_FILL_COLOR,

  /* Triangle */
  "linetooltriangle.linecolor": PRIMARY_LINE_COLOR,
  "linetooltriangle.fillBackground": true,
  "linetooltriangle.backgroundColor": PRIMARY_FILL_COLOR,

  /* Arc */
  "linetoolarc.linecolor": PRIMARY_LINE_COLOR,
  "linetoolarc.fillBackground": true,
  "linetoolarc.backgroundColor": PRIMARY_FILL_COLOR,

  /* Polyline */
  "linetoolpolyline.linecolor": PRIMARY_LINE_COLOR,
  "linetoolpolyline.fillBackground": true,
  "linetoolpolyline.backgroundColor": PRIMARY_FILL_COLOR,


  // ============================================================
  // ARROWS & MARKERS
  // ============================================================

  /* Arrow */
  // "linetoolarrow.linecolor": PRIMARY_LINE_COLOR,
  // "linetoolarrow.fillBackground": true,
  // "linetoolarrow.backgroundColor": PRIMARY_FILL_COLOR,
  // "linetoolarrow.textcolor": WHITE_TEXT_COLOR,

  /* Arrow Marker */
  "linetoolarrowmarker.backgroundColor": PRIMARY_LINE_COLOR,
  "linetoolarrowmarker.textcolor": WHITE_TEXT_COLOR,


  /* Arrow Mark Up */
  "linetoolarrowmarkup.color": PRIMARY_LINE_COLOR,

  /* Arrow Mark Down */
  "linetoolarrowmarkdown.color": PRIMARY_LINE_COLOR,

  /* Arrow Mark Left */
  "linetoolarrowmarkleft.color": PRIMARY_LINE_COLOR,

  /* Arrow Mark Right */
  "linetoolarrowmarkright.color": PRIMARY_LINE_COLOR,

  /* Flag */
  "linetoolflagnote.color": PRIMARY_LINE_COLOR,

  /* Bars Pattern */
  "linetoolbarspattern.color": PRIMARY_LINE_COLOR,


  // ============================================================
  // PRICE TOOLS
  // ============================================================

  /* Price Label */
  "linetoolpricelabel.borderColor": PRIMARY_LINE_COLOR,
  "linetoolpricelabel.backgroundColor": PRIMARY_FILL_COLOR,
  "linetoolpricelabel.textColor": WHITE_TEXT_COLOR,

  /* Price Note */
  "linetoolpricenote.borderColor": PRIMARY_LINE_COLOR,
  "linetoolpricenote.backgroundColor": PRIMARY_FILL_COLOR,
  "linetoolpricenote.textColor": WHITE_TEXT_COLOR,

  /* Date Range */
  "linetooldaterange.linecolor": PRIMARY_LINE_COLOR,
  "linetooldaterange.backgroundColor": PRIMARY_FILL_COLOR,
  "linetooldaterange.textcolor": WHITE_TEXT_COLOR,

  /* Date and Price Range */
  "linetooldateandpricerange.linecolor": PRIMARY_LINE_COLOR,
  "linetooldateandpricerange.backgroundColor": PRIMARY_FILL_COLOR,
  "linetooldateandpricerange.textcolor": WHITE_TEXT_COLOR,

  /* Reversal Zone */
  "linetoolreversalzone.linecolor": PRIMARY_LINE_COLOR,
  "linetoolreversalzone.fillBackground": true,
  "linetoolreversalzone.backgroundColor": PRIMARY_FILL_COLOR,
  "linetoolreversalzone.textcolor": WHITE_TEXT_COLOR,


  // ============================================================
  // ANNOTATIONS
  // ============================================================

  /* Text */
  "linetooltext.color": WHITE_TEXT_COLOR,
  "linetooltext.borderColor": PRIMARY_LINE_COLOR,
  "linetooltext.backgroundColor": PRIMARY_FILL_COLOR,

  /* Note */
  "linetoolnote.markerColor": PRIMARY_LINE_COLOR,
  "linetoolnote.borderColor": PRIMARY_LINE_COLOR,
  "linetoolnote.backgroundColor": PRIMARY_FILL_COLOR,
  "linetoolnote.textColor": WHITE_TEXT_COLOR,

  /* Callout */
  "linetoolcallout.linecolor": PRIMARY_LINE_COLOR,
  "linetoolcallout.borderColor": PRIMARY_LINE_COLOR,
  "linetoolcallout.backgroundColor": PRIMARY_FILL_COLOR,
  "linetoolcallout.textColor": WHITE_TEXT_COLOR,

  /* Balloon */
  "linetoolballoon.borderColor": PRIMARY_LINE_COLOR,
  "linetoolballoon.backgroundColor": PRIMARY_FILL_COLOR,
  "linetoolballoon.textColor": WHITE_TEXT_COLOR,

  /* Comment */
  "linetoolcomment.borderColor": PRIMARY_LINE_COLOR,
  "linetoolcomment.backgroundColor": PRIMARY_FILL_COLOR,
  "linetoolcomment.textColor": WHITE_TEXT_COLOR,


  // ============================================================
  // BRUSHES & FREE-DRAW
  // ============================================================

  /* Brush */
  "linetoolbrush.linecolor": PRIMARY_LINE_COLOR,

  /* Highlighter */
  "linetoolhighlighter.linecolor": PRIMARY_LINE_COLOR,

  /* Curve (smooth free draw) */
  "linetoolcurve.linecolor": PRIMARY_LINE_COLOR,


  // ============================================================
  // VOLUME / PROFILE TOOLS
  // ============================================================

  /* Anchored VWAP */
  "linetoolanchoredvwap.linecolor": PRIMARY_LINE_COLOR,
  "linetoolanchoredvwap.textcolor": WHITE_TEXT_COLOR,

  /* Anchored Volume Profile */
  "linetoolanchoredvp.linecolor": PRIMARY_LINE_COLOR,
  "linetoolanchoredvp.textcolor": WHITE_TEXT_COLOR,

  /* Fixed Range Volume Profile */
  "linetoolfixedrangevolumeprofile.linecolor": PRIMARY_LINE_COLOR,
  "linetoolfixedrangevolumeprofile.textcolor": WHITE_TEXT_COLOR,

};
