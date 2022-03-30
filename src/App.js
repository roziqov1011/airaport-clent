import { useQuery, gql, useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'

const COUNTRIES = gql`
  query {
    countries {
      id
      name
    }
  }
`

const REGIONS = gql`
  query regions($countryID: ID!){
    regions(countryID: $countryID) {
      id
      name
      price
    }
  }
`

const NEW_REGION = gql`
  mutation newRegion($name: String! $countryID: ID! $price: String!) {
    newRegion(name: $name countryID: $countryID price: $price) {
      id
      name
      price
    }
  }
`



function App() {


  const [ countryID, setCountryID ] = useState("")
  const { data } = useQuery(COUNTRIES)
  const { data: regionData  } = useQuery(REGIONS, {
    variables: { countryID }
  })
  const [ newRegion ] = useMutation(NEW_REGION, {
    update: (cache, data) => {
      console.log(data)
    }
  })

  const handleSubmit = e => {
    e.preventDefault()

    const { select, name, price } = e.target.elements

    newRegion({
      variables: {
        name: name.value,
        countryID: select.value,
        price: price.value
      }
    })
  }

  console.log(regionData);
  return (<>

    <form onSubmit={handleSubmit}>
      <select name='select'>
        <option value={"saksovul"} hidden={true}>Choose</option>
        {
          data && data.countries.map((e, i) => (
            <option key={i} value={e.id}>{e.name}</option>
          ))
        }
      </select>
      <input name='name' type="text" placeholder="category" autoComplete='off' />
      <input name='price' type="text" placeholder="price" autoComplete='off' />
      <button type='submit'>send</button>
    </form>

    {
      data && data.countries.map((e, i) => (
        <h3 onClick={() => setCountryID(e.id)} key={i}>{e.name}</h3>
      ))
    }

    {
      regionData && regionData.regions.map((e, i) => (
        <div key={i}>
          <span >{e.name} </span>
          <mark > {e.price} $</mark>
        </div>
      ))
    }
  </>)
}

export default App