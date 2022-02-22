import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      inStockOnly: false,
    };
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockOnlyChange = this.handleInStockOnlyChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleFilterTextChange(filterText) {
    this.setState({
      filterText: filterText,
    });
  }

  handleInStockOnlyChange(inStockOnly) {
    this.setState({
      inStockOnly: inStockOnly,
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    console.log(event)

    this.setState({
      [name]: value
    });
  }

  render() {
    const filterText = this.state.filterText;
    const inStockOnly = this.state.inStockOnly;
    const filteredCollection = this.props.collection.filter(product => {
      if(inStockOnly) {
        return product.stocked && product.name.toLowerCase().includes(filterText.toLowerCase());
      }
      return product.name.toLowerCase().includes(filterText.toLowerCase());
    });


    return (
      <div>
        <SearchBar onSearchChanges={this.handleInputChange} filterText={filterText} inStockOnly={inStockOnly} />
        <ProductTable collection={filteredCollection} filterText={filterText} inStockOnly={inStockOnly} />
      </div>
    );
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleChanges = this.handleChanges.bind(this);
  }

  handleChanges(event) {
    console.log('searchbar', event);
    this.props.onSearchChanges(event);
  }

  render() {
    return(
      <form>
          <div>
            <input id="search" name="filterText" type="text" placeholder='Search...' onChange={this.handleChanges} value={this.props.filterText} />
          </div>
          <div>
            <input type="checkbox" name="inStockOnly" onChange={this.handleChanges} checked={this.props.inStockOnly} />
            <label htmlFor="stocked">Only show products in stock</label>
          </div>
      </form>
    );
  }
}

function ProductTable(props) {
  const groupedProducts = groupBy(props.collection, 'category');
  const categories = Object.keys(groupedProducts);
  const rows = categories.map((category) => {
    const products = groupedProducts[category].map((product) => {
      return <ProductRow product={product} key={product.id} />
    });
    
    return (
      <tbody id={category}>
        <ProductCategoryRow key={category} category={category} />
        {products}
      </tbody>
    );
  });
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      {rows}
    </table>
  )
}

function ProductCategoryRow(props) {
  return (
    <tr>
      <th colSpan="2">
        {props.category}
      </th>
    </tr>
  )
}

function ProductRow(props) {
  return (
    <tr>
      <td>{props.product.name}</td>
      <td>{props.product.price}</td>
    </tr>
  );
}

function groupBy(arr, property) {
  return arr.reduce((acc, cur) => {
    acc[cur[property]] = [...acc[cur[property]] || [], cur];
    return acc;
  }, {});
}

// ========================================

const DATA_COLLECTION = [
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];

ReactDOM.render(
  <FilterableProductTable collection={DATA_COLLECTION}/>,
  document.getElementById('root')
);
