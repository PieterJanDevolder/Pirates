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
  SizeL?: number,
  SizeH?: number
}

export interface IHomeProps {
  navigation: Navigation
}

export interface IHomeState {
  GameInfo?: IGameInfo,
  uiItems: Map<string, React.ReactElement>,
  LastBoatLocation: string,
  AllowedRange: string[]
}

interface IGameInfo {
  BoatLocationRow?: string,
  BoatLocationColumn?: number,
  BoatMovingAllowed?: boolean,
  FiringAllowed?: boolean
}

interface IGameData {
  username?: string,
  password?: string,
  date?: Date,
  GameInfo?: IGameInfo
};


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
  border: 1px dotted  black;
  margin: 0 auto;
  grid-column-start: ${props => props.ColumnStart};
  grid-column-end: ${props => props.ColumnStart! + props.SizeL!};
  grid-row-start:${props => props.RowStart};
  grid-row-end:${props => props.RowStart! + + props.SizeH!};

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
      uiItems: new Map(),
      LastBoatLocation: "",
      AllowedRange: []
    }
  }

  private iGetDataRequest = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('KEY_TOKEN')! }
  };

  interval: any;

  async GetDataRequest() {

    // POST request using fetch with async/await
    const response = await fetch('http://localhost:3100/api/GetData', this.iGetDataRequest);
    const data: IGameInfo = await response.json();
    console.log(data)

    if (
      this.state.GameInfo?.BoatMovingAllowed !== data.BoatMovingAllowed ||
      this.state.GameInfo?.BoatLocationColumn !== data.BoatLocationColumn ||
      this.state.GameInfo?.BoatLocationRow !== data.BoatLocationRow
    ) {
      this.setState({ GameInfo: data });
      var key = data.BoatLocationRow! + data.BoatLocationColumn!

      this.moveBoat(key)

      if (this.state.LastBoatLocation !== key && this.state.LastBoatLocation !== "") {
        this.removeBoat(this.state.LastBoatLocation)
      }

      this.setState({ LastBoatLocation: key })

      console.log('moving boat')

    }
  }

  async SendDataRequest(GameInfo: IGameInfo) {
    // POST request using fetch with async/await
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('KEY_TOKEN')! },
      body: JSON.stringify({
        "BoatLocationRow": GameInfo.BoatLocationRow,
        "BoatLocationColumn": GameInfo.BoatLocationColumn
      })
    };
    const response = await fetch('http://localhost:3100/api/Change', requestOptions);

    // const data : IGameData= await response.json();
  }

  async componentDidMount() {
    this.interval = setInterval(() => { this.GetDataRequest() }, 1000)
    this.renderTemplate()
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  renderTemplate() {
    let uiItems = new Map();
    //Header
    for (let index = 1; index <= 20; index++) {
      uiItems.set(index,
        <Field SizeH={1} SizeL={1} ColumnStart={index} RowStart={1} key={index}>
          {index}
        </Field>
      )
    }

    //Side
    for (let index = 1; index <= 20; index++) {
      uiItems.set('_' + index,
        <Field SizeH={1} SizeL={1} ColumnStart={1} RowStart={index + 1} key={'_' + index}>
          {String.fromCharCode(64 + index)}
        </Field>
      )
    }

    //Rows
    for (let rowindex = 2; rowindex <= 21; rowindex++) {
      for (let columnindex = 2; columnindex <= 20; columnindex++) {

        //Create key string 
        var Key = String.fromCharCode(63 + rowindex) + columnindex.toString()
        if (columnindex == 999999 && rowindex == 99999) {
          uiItems.set(Key,
            <Field className="boat" SizeH={1} SizeL={1} ColumnStart={columnindex} RowStart={rowindex} key={Key}>
            </Field>
          )
        }
        else {
          uiItems.set(Key,
            <Field className="" SizeH={1} SizeL={1} ColumnStart={columnindex} RowStart={rowindex} id={Key} key={Key}>
            </Field>
          )

        }

      }
    }
    this.setState({ uiItems: uiItems })
    return uiItems
  }

  moveBoat(ItemKey: string) {

    if (this.state.LastBoatLocation !== "") {
      console.log(`Remove area: ${this.state.LastBoatLocation} `)
      this.removeRadius(this.state.LastBoatLocation)
    }

    if (ItemKey != "") {
      console.log(`Create area: ${ItemKey} `)
      this.createRadius(ItemKey)
    }


    var itemFromMap = this.state.uiItems.get(ItemKey)
    var item = <Field className="boat" SizeH={itemFromMap?.props.SizeH} SizeL={itemFromMap?.props.SizeL} ColumnStart={itemFromMap?.props.ColumnStart} RowStart={itemFromMap?.props.RowStart} key={itemFromMap?.key?.toString()}>
    </Field>
    this.state.uiItems.set(ItemKey, item)

    this.setState({ uiItems: this.state.uiItems })
  }

  createRadius(ItemKey: string) {

    var AllowedList: string[] = []
    //Create radius
    //Left top
    var Row = String.fromCharCode(ItemKey.charCodeAt(0) - 1);
    var Column = Number(ItemKey.substring(1)) - 1;
    AllowedList.push(Row.toString() + Column.toString())

    //Mid top
    Column = Number(ItemKey.substring(1));
    AllowedList.push(Row.toString() + Column.toString())

    //Right top
    Column = Number(ItemKey.substring(1)) + 1;
    AllowedList.push(Row.toString() + Column.toString())

    //Left mid
    var Row = String.fromCharCode(ItemKey.charCodeAt(0));
    var Column = Number(ItemKey.substring(1)) - 1;
    AllowedList.push(Row.toString() + Column.toString())

    //Right mid
    Column = Number(ItemKey.substring(1)) + 1;
    AllowedList.push(Row.toString() + Column.toString())

    //Left bottom
    var Row = String.fromCharCode(ItemKey.charCodeAt(0) + 1);
    var Column = Number(ItemKey.substring(1)) - 1;
    AllowedList.push(Row.toString() + Column.toString())

    //Mid bottom
    Column = Number(ItemKey.substring(1));
    AllowedList.push(Row.toString() + Column.toString())

    //Right bottom
    Column = Number(ItemKey.substring(1)) + 1;
    AllowedList.push(Row.toString() + Column.toString())

    this.setState({AllowedRange : AllowedList})

     for (let index = 0; index < AllowedList.length; index++) {
      var itemFromMap = this.state.uiItems.get(AllowedList[index])
      var item = <Field onClick={(event) => { this.moveBoatFromUi(event.currentTarget.id) }} className="inrange" SizeH={itemFromMap?.props.SizeH} SizeL={itemFromMap?.props.SizeL} ColumnStart={itemFromMap?.props.ColumnStart} RowStart={itemFromMap?.props.RowStart} id={itemFromMap?.key?.toString()} key={itemFromMap?.key?.toString()}>
      </Field>
      this.state.uiItems.set(AllowedList[index], item)
    }
  }

  removeRadius(ItemKey: string) {

    debugger
    var AllowedList: string[] = []
    //Create radius
    //Left top
    var Row = String.fromCharCode(ItemKey.charCodeAt(0) - 1);
    var Column = Number(ItemKey.substring(1)) - 1;
    AllowedList.push(Row.toString() + Column.toString())

    //Mid top
    Column = Number(ItemKey.substring(1));
    AllowedList.push(Row.toString() + Column.toString())

    //Right top
    Column = Number(ItemKey.substring(1)) + 1;
    AllowedList.push(Row.toString() + Column.toString())

    //Left mid
    var Row = String.fromCharCode(ItemKey.charCodeAt(0));
    var Column = Number(ItemKey.substring(1)) - 1;
    AllowedList.push(Row.toString() + Column.toString())

    //Right mid
    Column = Number(ItemKey.substring(1)) + 1;
    AllowedList.push(Row.toString() + Column.toString())

    //Left bottom
    var Row = String.fromCharCode(ItemKey.charCodeAt(0) + 1);
    var Column = Number(ItemKey.substring(1)) - 1;
    AllowedList.push(Row.toString() + Column.toString())

    //Mid bottom
    Column = Number(ItemKey.substring(1));
    AllowedList.push(Row.toString() + Column.toString())

    //Right bottom
    Column = Number(ItemKey.substring(1)) + 1;
    AllowedList.push(Row.toString() + Column.toString())


    for (let index = 0; index < AllowedList.length; index++) {
      var itemFromMap = this.state.uiItems.get(AllowedList[index])
      var classNames: string = itemFromMap?.props.className
      var item = <Field onClick={(event) => { this.moveBoatFromUi(event.currentTarget.id) }} className={classNames.replace('inrange','')} SizeH={itemFromMap?.props.SizeH} SizeL={itemFromMap?.props.SizeL} ColumnStart={itemFromMap?.props.ColumnStart} RowStart={itemFromMap?.props.RowStart} id={itemFromMap?.key?.toString()} key={itemFromMap?.key?.toString()}>
      </Field>
      this.state.uiItems.set(AllowedList[index], item)
    }
  }


  removeBoat(ItemKey: string) {

    var itemFromMap = this.state.uiItems.get(ItemKey)

    var item = <Field SizeH={itemFromMap?.props.SizeH} SizeL={itemFromMap?.props.SizeL} ColumnStart={itemFromMap?.props.ColumnStart} RowStart={itemFromMap?.props.RowStart} key={itemFromMap?.key?.toString()}>
    </Field>

    this.state.uiItems.set(ItemKey, item)
    this.setState({ uiItems: this.state.uiItems })
  }

  moveBoatFromUi(ItemKey: string) {
    if (this.state.GameInfo?.BoatMovingAllowed) {
      this.SendDataRequest({ BoatLocationRow: ItemKey[0], BoatLocationColumn: Number(ItemKey.substring(1)) })
    }
  }


  renderObj = () => {

    var entries: JSX.Element[] = []

    this.state.uiItems.forEach(val => {
      entries.push(val)
    })

    return entries
  }

  Logout = () => {
    this.props.navigation.navigate("/Login")
  }

  public render() {

    const username = localStorage.getItem('Username')

    return (
      <>
        {/* <button onClick={event => { this.moveBoat("B2") }}>CLICK ON ME</button> */}
        <FieldWrapper>
          {this.renderObj()}
        </FieldWrapper>
      </>
    );
  }
}
