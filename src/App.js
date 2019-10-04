import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Button, Container, Title } from 'rbx';

const Product = ({ key, product }) => (
  <h5>{ product }</h5>
)
const App = () => {
  const [data, setData] = useState({});
  const products = Object.values(data);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);
  const productList = ({ products }) => (
    <Container>
      {products.map(product => <Product key={product.sku} product={ product.title } /> )}
    </Container>
  )

  const productLists = ({ products }) => (
    <Container>
      {products.map(product => <Container><li key={product.sku}>{product.title}</li></Container>)}
    </Container>
  )

  return (
    <div>            
      {/* <productLists products={ products }/> */}
      {products.map(product => <Container key={product.sku}>{product.title}<img src={`../images/${product.sku}_1.jpg`}></img></Container>)}
    </div>
  );
};

export default App;