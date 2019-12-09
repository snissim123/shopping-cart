import React, { useEffect, useState, forceUpdate } from 'react';
import {FormControl, CardHeader, CardContent, CardMedia, Container, Typography} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';


const cardStyles = makeStyles(theme => ({
  grid: {
    marginTop: 100,   
    paddingLeft: 60,
    paddingRight: 60,
    marginLeft: 20,
  },
  card:{
    display:"flex",
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: 300,
    height: 300,
    paddingTop: 30,
    paddingBottom: 20,
  },
  content:{
    display:"flex",
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  button:{
    backgroundColor: "black",
    color: 'white',
    width: 260,
    height: 50,
    marginTop: 30,
  },
  cart: {
    backgroundColor: "black",
    color: "white",
    float: "right",
    margin: 10,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
  },
  drawer: {
    width: 200,
    flexShrink: 0,
    float: "left",
  },
  title: {
    weight: "heavy",
    fontSize: 32,
    textAlign: "center",
    margin: 20
    
  }

}));


const App = () => {
  const [data, setData] = useState({});
  const [openCart, setOpenCart] = useState(false);
  const [cart, setCart] = useState([]);
  const products = Object.values(data);
  const classes = cardStyles();
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  const productDict = {};
  for (let i = 0; i < products.length; i += 1) {
    productDict[products[i].sku] = products[i];
  }

  const cartClick = () => {
    setOpenCart(!openCart);
  };

  const addCart = (id) => {
    setOpenCart(true);
    let cartCopy = cart;
    let found = false;
    for (let i=0; i<cartCopy.length; i+=1){
      if (cartCopy[i].productId === id) {
        cartCopy[i].quantity += 1;
        found = true;
        break;
      }
    }
    if (!found) {
      cartCopy.push({
        productId: id,
        quantity: 1,
        product: productDict[id],
      })
    }
    setCart(cartCopy);
  };

  return (
  <div>
    <Button className={classes.cart} onClick={cartClick}>Cart</Button>
    <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={openCart}
        classes={{
          paper: classes.drawer,
        }}
      >
        <Button onClick={cartClick}>x</Button>
        <Typography><strong>Your Cart</strong></Typography>
        {cart.map(product => <Typography>{cart.productId} </Typography>)}
      </Drawer>
    <Typography className={classes.title}>T-Shirt Store</Typography>
    <Typography className={classes.grid}>{products.length} product(s) found.</Typography>
    <Grid container spacing={3} className={classes.grid}>       
          {products.map(product => 
            (<Grid item xs={4}>
              <Card key={product.sku} className={classes.card}>
                <CardMedia><img src={"data/products/"+product.sku+"_1.jpg"} height="200" width="137.5"></img></CardMedia>
                <CardContent className={classes.content}>
                  {product.title}
                  <Typography >${product.price}</Typography>
                  <Button onClick={() => addCart(product.sku)} variant="contained" className={classes.button} size="medium">Add to cart</Button>
                </CardContent>
              </Card>
          </Grid>))}
        </Grid>
      </div>
  );
};

export default App;