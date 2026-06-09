export default class HeatmapBuilder {
  static CreateHeatmap(data, w, h, by_field = "value") {
    // Sort First
    data.sort((a, b) => b[by_field] - a[by_field]);

    const total = data.reduce((s, d) => s + d[by_field], 0);
    const area = w * h;

    data.forEach((d) => {
      d.rect = { x: 0, y: 0, w: w, h: h };
    });

    if (w <= 0 || h <= 0) return;

    data.forEach((d) => {
      d.area = (d[by_field] / total) * area;
      d.length = Math.sqrt(d.area);
    });

    let x = 0;
    let y = 0;
    let offset_x = 0;
    let offset_y = 0;
    let cw = w;
    let ch = h;

    if (!data.length) return;
    let current_max = data[0].length;

    let done = [];
    data.forEach((d) => {
      if (done.length > 0) {
        if (cw >= ch) {
          if (y + d.length > h) {
            // Height Oveflow
            this.fillHeight(done, ch);
            current_max = done[0].rect.w;
            offset_x += current_max;
            x = offset_x;
            y = offset_y;
            cw -= current_max;
            current_max = d.length;
            done = [];
          }
        } else {
          if (x + d.length > w) {
            // Width Overflow
            this.fillWidth(done, cw);
            current_max = done[0].rect.h;
            offset_y += done[0].rect.h;
            x = offset_x;
            y = offset_y;
            ch -= current_max;
            current_max = d.length;
            done = [];
          }
        }
      }

      d.rect = { x: x, y: y, w: d.length, h: d.length };

      if (cw >= ch) this.fillWidth([d], current_max);
      else this.fillHeight([d], current_max);

      done.push(d);

      if (cw >= ch) y += d.rect.h;
      else x += d.rect.w;
    });

    // Fill the rest of the Area
    this.fillHeight(done, ch);
    this.fillWidth(done, cw);

    // Remove Area and Length
    data.forEach((d) => {
      delete d.area;
      delete d.length;
    });
  }

  // Helper Functions
  static fillHeight(data, max) {
    const sum = data.reduce((s, d) => s + d.rect.h, 0);
    if (!sum) return;

    let added = 0;

    // Fill the given height without changing Area.
    data.forEach((d) => {
      d.rect.y += added;

      const new_h = (d.rect.h / sum) * max;
      added += new_h - d.rect.h;

      d.rect.h = new_h;
      d.rect.w = d.area / new_h;
    });
  }

  static fillWidth(data, max) {
    const sum = data.reduce((s, d) => s + d.rect.w, 0);
    if (!sum) return;

    let added = 0;

    // Fill the given width without changing Area.
    data.forEach((d) => {
      d.rect.x += added;

      const new_w = (d.rect.w / sum) * max;
      added += new_w - d.rect.w;

      d.rect.w = new_w;
      d.rect.h = d.area / new_w;
    });
  }
}
