import * as React from 'react';
import { Navigation } from 'navi';
import styled from 'styled-components';
import { ReactComponent as Logo } from '../Images/001-ingots.svg'
// import { ReactComponent as Ship } from '../Images/M5AzXVH-pirate-ship-vector.svg'
import mainLogo from '../Images/PinClipart.com_pirate-images-clip-art_474598.png'
import './Home.css'

interface IFieldProps {
  ColumnStart?: number,
  ColumnEnd?: number,
  RowStart?: number,
  RowEnd?: number,
  SizeL?:number,
  SizeH?:number
}

export interface IHomeProps {
  navigation: Navigation
}

export interface IHomeState {
  data: any,
  uiItems: any[],
  teststring:string
}



const FieldWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display:grid;
  grid-template-columns:  repeat(20,1fr);
  grid-template-rows:  repeat(20,1fr);
  grid-gap: 1px;
`


const Field = styled.div<IFieldProps>`
  width:100%;
  height:100%;
  background-color:#006994;
  border: 2px solid black;
  margin: 0 auto;
  grid-column-start: ${props => props.ColumnStart};
  grid-column-end: ${props => props.ColumnStart! + props.SizeL!};
  grid-row-start:${props => props.RowStart};
  grid-row-end:${props => props.RowStart! +  + props.SizeH!};

  display: flex;
  justify-content: center;
  align-items: center;
 
`

const HeadLabel = styled.div`
  text-align:center;
  font-size:2em;
`


export default class Home extends React.Component<IHomeProps, IHomeState> {

  constructor(props: IHomeProps) {
    super(props);

    this.state = {
      data: {},
      uiItems: [],
      teststring : ""
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

    // this.interval = setInterval(() => { this.request() }, 1000)
    this.renderTemplate()
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  renderTemplate() {
    let uiItems = [];
    //Header
    for (let index = 1; index <= 20; index++) {
      uiItems.push(
        <Field  SizeH={1} SizeL={1}  ColumnStart={index} RowStart={1} key={index}>
          {index}
        </Field>
      )
    }

    //Side
    for (let index = 1; index <= 20; index++) {
      uiItems.push(
        <Field SizeH={1} SizeL={1} ColumnStart={1} RowStart={index + 1} key={'_' + index}>
          {String.fromCharCode(64 + index)}
        </Field>
      )
    }

    //Rows
    for (let rowindex = 2; rowindex <= 21; rowindex++) {
      for (let columnindex = 2; columnindex <= 20; columnindex++) {


        if(columnindex == 4 && rowindex == 5){
          uiItems.push(
            <Field  SizeH={1} SizeL={3}  ColumnStart={columnindex} RowStart={rowindex} key={'&' + 'R'+rowindex.toString()+ 'C'+ columnindex.toString()}>
                    <img  height='100%' width='100%' src={mainLogo}  alt="fireSpot"/>
            </Field>
          )
        }
        else{
          uiItems.push(
            <Field SizeH={1} SizeL={1} ColumnStart={columnindex} RowStart={rowindex} key={'&' + 'R'+rowindex.toString()+ 'C'+ columnindex.toString()}>
            </Field>
          )
        }


      }

 
      // var ff = <Field ColumnStart={10} RowStart={3} key={99}>
      //   <Logo width={'100%'} height={'100%'}  ></Logo>
      // </Field>

// uiItems.push(ff)

//  this.setState({teststring:"dfd"})
       this.setState({uiItems:uiItems})



      // uiItems.push(
      //   <Field ColumnStart={10} RowStart={3} key={99}>
      //     <Logo width={'100%'} height={'100%'}  ></Logo>
      //   </Field>
      // )

    }




    return uiItems
  }




  public render() {

    const Logout = () => {
      this.props.navigation.navigate("/Login")
    }

    const username = localStorage.getItem('Username')


    return (



      <FieldWrapper>
        {this.state.uiItems}
      </FieldWrapper>


    );
  }
}
