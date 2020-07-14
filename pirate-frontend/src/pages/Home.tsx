import * as React from 'react';
import { Navigation } from 'navi';
import styled from 'styled-components';
import { ReactComponent as Logo } from '../Images/001-ingots.svg'

interface IFieldProps {
  ColumnStart?: number,
  ColumnEnd?: number,
  RowStart?: number,
  RowEnd?: number
}

export interface IHomeProps {
  navigation: Navigation
}

export interface IHomeState {
  data: any
}

const Header = styled.div`
  width: 100vw;
  height: 40px;
  display:grid;
  grid-template-columns:  repeat(20,1fr);
  margin: 0 auto;
  grid-gap: 0;
`

const FieldWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display:grid;
  grid-template-columns:  repeat(20,1fr);
  grid-template-rows:  repeat(20,1fr);
  margin: 0 auto;
  grid-gap: 0;
`

const ColumnWrapper = styled.div`
  width: 100vw;
  height: calc(100%-40px);
  display:grid;
  grid-template-columns:  repeat(20,1fr);
  grid-template-rows:  repeat(20,1fr);
  margin: 0 auto;
  grid-gap: 0;
`




const Field = styled.div<IFieldProps>`
  width:100%;
  height:100%;
  background-color:#006994;
  border: 2px solid black;
  margin: 0 auto;
  grid-column-start: ${props => props.ColumnStart};
  grid-column-end: ${props => props.ColumnStart! + 1};
  grid-row-start:${props => props.RowStart};
  grid-row-end:${props => props.RowStart! + 1};
`

const HeadLabel = styled.div`
  text-align:center;
  font-size:2em;
`


export default class Home extends React.Component<IHomeProps, IHomeState> {

  constructor(props: IHomeProps) {
    super(props);

    this.state = {
      data: {}
    }
  }

  interval: any;

  async request() {

    // POST request using fetch with async/await
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('KEY_TOKEN')! }
    };
    const response = await fetch('http://localhost:3100/api/GetData', requestOptions);
    const data = await response.json();
    console.log(data)
    this.setState({ data: data });

  }

  async componentDidMount() {
    // set Interval
    // this.interval = setInterval(this.request, 1000);

    this.interval = setInterval(() => { this.request() }, 1000)

  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  renderHeader() {
    let uiItems = [];

//Header
    for (let index = 1; index <= 20; index++) {
      uiItems.push(
        <Field ColumnStart={index} RowStart={1} key={index}>
          <HeadLabel>    {index}</HeadLabel>
      
        </Field>
      )
    }


//Side
for (let index = 1; index <= 20; index++) {
  uiItems.push(
    <Field ColumnStart={1} RowStart={index+1} key={index}>
      <HeadLabel>    {index}</HeadLabel>
  
    </Field>
  )
}



      // uiItems.push(
      //   <Field ColumnStart={10} RowStart={3} key={99}>
      //     <Logo width={'100%'} height={'100%'}  ></Logo>
      //   </Field>
      // )
 
    return uiItems
  }

  // renderDivs() {
  //   let count = 2, uiItems = [];


  //   while (count--) {
  //     uiItems.push(
  //       <Field ColumnStart={count} RowStart={count} key={count}>
  //         <Logo width={'100%'} height={'100%'}  ></Logo>
  //       </Field>
  //     )
  //   }


  //   // while (count--)

  //   //   if (count === 399) {
  //   //     uiItems.push(
  //   //       <Field ColumnStart={4} RowStart={2}  key={count}>
  //   //         <Logo width={'100%'}  height={'100%'}  ></Logo>      
  //   //     </Field>        
  //   //     )

  //   //   }
  //   //   else {
  //   //     uiItems.push(

  //   //       <Field key={count}>
  //   //         uniqueID: {count}
  //   //       </Field>

  //   //     )



  //   //   }





  //   return uiItems;
  // }



  public render() {

    const Logout = () => {
      this.props.navigation.navigate("/Login")
    }

    const username = localStorage.getItem('Username')


    return (



        <FieldWrapper>

          {this.renderHeader()}
        </FieldWrapper>


    );
  }
}
