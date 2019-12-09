import React, { useEffect, useState } from 'react';
import {FormControl, CardHeader, CardContent, CardMedia, Container} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles} from '@material-ui/core/styles';

const cardStyles = makeStyles(theme => ({
  grid: {
    marginTop: 100,   
    paddingLeft: 60,
    paddingRight: 60,
    marginLeft: 245,
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
  }

}));

const App = () => {
  const [data, setData] = useState({});
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

  return (
    // <ul>
    //   {products.map(product => 
    //     <Card textAlign="centered">
    //       <img src={"data/products/"+product.sku+"_1.jpg"} height="80" width="55"></img>
    //       <li key={product.sku}>{product.title}</li>
    //     </Card>        
    //     )}
    // </ul>


  <Grid container spacing={3} className={classes.grid}>       
        {products.map(product => 
          (<Grid item xs={4}>
            <Card key={product.sku} className={classes.card}>
              <CardMedia><img src={"data/products/"+product.sku+"_1.jpg"} height="200" width="137.5"></img></CardMedia>
              <CardContent className={classes.content}>
                {product.title}
                <Button variant="contained" color="primary" size="large">View Doctor Bio</Button>
              </CardContent>
            </Card>
        </Grid>))}
       </Grid>
  );
};

export default App;