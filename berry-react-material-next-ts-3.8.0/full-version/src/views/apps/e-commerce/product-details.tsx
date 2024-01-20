'use client';

import { useEffect, useState, SyntheticEvent } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// material-ui
import { Box, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';

// project imports
import ProductImages from 'components/application/e-commerce/ProductDetails/ProductImages';
import ProductInfo from 'components/application/e-commerce/ProductDetails/ProductInfo';
import ProductDescription from 'components/application/e-commerce/ProductDetails/ProductDescription';
import ProductReview from 'components/application/e-commerce/ProductDetails/ProductReview';
import RelatedProducts from 'components/application/e-commerce/ProductDetails/RelatedProducts';

import Loader from 'ui-component/Loader';
import Chip from 'ui-component/extended/Chip';
import MainCard from 'ui-component/cards/MainCard';
import FloatingCart from 'ui-component/cards/FloatingCart';

import { gridSpacing } from 'store/constant';
import { useDispatch, useSelector } from 'store';
import { getProduct } from 'store/slices/product';
import { resetCart } from 'store/slices/cart';

// types
import { TabsProps } from 'types';

function TabPanel({ children, value, index, ...other }: TabsProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-details-tabpanel-${index}`}
      aria-labelledby={`product-details-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `product-details-tab-${index}`,
    'aria-controls': `product-details-tabpanel-${index}`
  };
}

type Props = {
  id: string;
};

const ProductDetails = ({ id }: Props) => {
  const params = useParams();

  // const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { product } = useSelector((state) => state.product);

  const [loading, setLoading] = useState<boolean>(true);

  // product description tabs
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    // getProduct();
    dispatch(getProduct(id as string)).then(() => setLoading(false));

    // clear cart if complete order
    if (cart.checkout.step > 2) {
      dispatch(resetCart());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(getProduct(id as string));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Loader />;
  return (
    <Grid container alignItems="center" justifyContent="center" spacing={gridSpacing}>
      <Grid item xs={12} lg={10}>
        <MainCard>
          {product && product?.id === Number(id) && (
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={6}>
                <ProductImages product={product} />
              </Grid>
              <Grid item xs={12} md={6}>
                <ProductInfo product={product} />
              </Grid>
              <Grid item xs={12}>
                <Tabs
                  value={value}
                  indicatorColor="primary"
                  onChange={handleChange}
                  sx={{}}
                  aria-label="product description tabs example"
                  variant="scrollable"
                >
                  <Tab component={Link} href="#" label="Description" {...a11yProps(0)} />
                  <Tab
                    component={Link}
                    href="#"
                    label={
                      <Stack direction="row" alignItems="center">
                        Reviews <Chip label={String(product.salePrice)} size="small" chipcolor="secondary" sx={{ ml: 1.5 }} />
                      </Stack>
                    }
                    {...a11yProps(1)}
                  />
                </Tabs>
                <TabPanel value={value} index={0}>
                  <ProductDescription />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <ProductReview product={product} />
                </TabPanel>
              </Grid>
            </Grid>
          )}
        </MainCard>
      </Grid>
      <Grid item xs={12} lg={10} sx={{ mt: 3 }}>
        <Typography variant="h2">Related Products</Typography>
      </Grid>
      <Grid item xs={11} lg={10}>
        <RelatedProducts id={params?.id?.toString()} />
      </Grid>
      <FloatingCart />
    </Grid>
  );
};

export default ProductDetails;
