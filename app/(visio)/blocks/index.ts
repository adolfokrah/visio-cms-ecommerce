import { BlockList } from 'visio-cms-lib/types';
import Hero from './Hero';
import Navbar from './Navbar';
import FeaturedProducts from './FeaturedProducts';
import ShopByCategory from './ShopByCategory';
import CollectionSales from './CollectionsSales';
import Incentives from './Incentives';
import Footer from './Footer';
import ProductsList from './ProductsList';
import ProductDetails from './ProductDetails';
import ShoppingCart from './ShoppingCart';
const blocks = [
  Hero,
  Navbar,
  FeaturedProducts,
  ShopByCategory,
  CollectionSales,
  Incentives,
  Footer,
  ProductsList,
  ProductDetails,
  ShoppingCart,
] as unknown as BlockList[];

export default blocks;
