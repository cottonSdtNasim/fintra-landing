export function duplicateWithVariance(input) {
  return input.map((item) => {
    const marketAdjustment = 0.01 * (Math.random() < 0.5 ? -1 : 1);

    const new_price = Math.random() * 4 * (Math.random() < 0.5 ? -1 : 1);

    return {
      ...item,
      volume: +(item.volume + item.volume * marketAdjustment).toFixed(2),
      change: +new_price.toFixed(2),
    };
  });
}

export function prepareStockData(data) {
  // Clone and Sort
  return data.map((d) => ({
    ...d,
    abbr: String(d.stock).slice(0, 3),
    id: d.stock.replace(/\s+/g, "-").toLowerCase(),
  }));
}

export function buildCategoryGroups(data) {
  const Categories = [...new Set(data.map((d) => d.category))];

  return Categories.map((cat) => {
    const categoryData = data.filter((d) => d.category === cat);

    const totalVolume = categoryData.reduce((sum, d) => sum + d.volume, 0);

    return {
      category: cat,
      total_volume: totalVolume,
      data: categoryData,
    };
  });
}
