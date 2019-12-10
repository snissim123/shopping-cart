import React, { useEffect, useState, forceUpdate } from 'react';
import {FormControl, CardHeader, CardContent, CardMedia, Container, Typography} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Message, Title } from "rbx";

const firebaseConfig = {
  apiKey: "AIzaSyAyTBlA49bKh0fTIBXmdagnfO5ASSdfwDE",
  authDomain: "shopping-cart-a349c.firebaseapp.com",
  databaseURL: "https://shopping-cart-a349c.firebaseio.com",
  projectId: "shopping-cart-a349c",
  storageBucket: "shopping-cart-a349c.appspot.com",
  messagingSenderId: "406377467757",
  appId: "1:406377467757:web:f7f737706a997297f51464"
};

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

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
    width: 300,
    flexShrink: 0,
    float: "left",
  },
  title: {
    weight: "heavy",
    fontSize: 32,
    textAlign: "center",
    margin: 20
    
  },
  cartProducts: {
    float: "left",
    marginTop: 20,
  },
  cartTop: {
    margin: 30,
    float: "left"
  },
  removeProduct: {
    width: 240,
    align: "center"
  },

}));



const SignIn = () => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebase.auth()}
  />
);

const App = () => {
  const [data, setData] = useState({});
  const [openCart, setOpenCart] = useState(false);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);

  const products = Object.values(data);
  const classes = cardStyles();
  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) setData(snap.val());
    }
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  const Banner = ({ user }) => (
    <React.Fragment>
      { user ? <Welcome user={ user } /> : <SignIn /> }
    </React.Fragment>
  );
  
  const Welcome = ({ user }) => (
    <Message color="info">
      <Message.Header>
        Welcome, {user.displayName}
        <Button primary onClick={() => firebase.auth().signOut()}>
          Log out
        </Button>
      </Message.Header>
    </Message>
  );

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
    setTotal(total + productDict[id].price);
  };

  const removeItem = (id) => {
    let cartCopy = cart;
    for (let i=0; i<cartCopy.length; i+=1){
      if (cartCopy[i].productId === id) {
        cartCopy[i].quantity -= 1;
        if (cartCopy[i].quantity === 0) {
          cartCopy.splice(i, 1);
        }
        break;
      }
    }
    setCart(cartCopy);
    setTotal(total - productDict[id].price);
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
        <Typography className={classes.cartTop}><strong>Your Cart</strong></Typography>
        <div>
        {cart.map(product =>
        <Container className={classes.cartProducts}>
          <Typography><strong>{product.product.title}</strong></Typography>
          <Typography>{product.quantity} x ${product.product.price}</Typography>
          <img src={"data/products/"+product.product.sku+"_1.jpg"} height="80" width="55"></img>
          <Button className={classes.removeProduct} onClick={() => removeItem(product.product.sku)}>x</Button>
          <Divider/>
        </Container>
          )}
          <Typography className={classes.cartTop}><strong>Cart total: ${total}</strong></Typography>
        </div>
        
      </Drawer>
    <Banner user={ user } />
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