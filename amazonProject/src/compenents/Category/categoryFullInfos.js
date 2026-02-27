/**
 * categoryFullInfos.js - Product Categories Data
 *
 * Defines all available product categories with their metadata.
 * Each category object contains:
 * - title: Display name shown to users
 * - name: URL-friendly identifier used in routes
 * - imglink: URL to category banner image
 *
 * Used by the Category component to render category cards on the landing page.
 * When a user clicks a category, they are navigated to /category/:name
 */

export const categoryImage = [
  {
    title: "Electronics",
    name: "electronics",
    imglink:
      "https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2020/May/Dashboard/Fuji_Dash_TV_2X._SY304_CB4325179003_.jpg",
  },
  {
    title: "Discover fashion trends",
    name: "women's clothing",
    imglink:
      "https://images-na.ssl-images-amazon.com/images/G/01/softlines/shopbop/ingress/2023/March/mp_20230219_ff_desktopsinglecategory_desktop_379x304_1._SY304_CBe163539047_.jpg",
  },
  {
    title: "Men's Clothing",
    name: "men's clothing",
    imglink:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
  },
  {
    title: "Jewelry",
    name: "jewelery",
    imglink:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80",
  },
];
