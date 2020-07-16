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

interface ILocation {
  location: string,
  type: string
}

interface IGameInfo {
  BoatLocationRow?: string,
  BoatLocationColumn?: number,
  BoatMovingAllowed?: boolean,
  FiringAllowed?: boolean,
  OwnTreasure?: ILocation,
  OtherTreasures?: ILocation,
  Obstacles?: ILocation
}

// interface IGameData {
//   username?: string,
//   password?: string,
//   date?: Date,
//   GameInfo?: IGameInfo
// };


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
  grid-row-end:${props => props.RowStart! + props.SizeH!};

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

    if (
      JSON.stringify(this.state.GameInfo) !== JSON.stringify(data)
    ) {


      var NewLocation = data.BoatLocationRow! + data.BoatLocationColumn!

      //BOAT
      if (this.state.GameInfo?.BoatLocationColumn != data.BoatLocationColumn || this.state.GameInfo?.BoatLocationRow != data.BoatLocationRow) {
        this.moveBoat(NewLocation)
        // this.removeBoat(this.state.LastBoatLocation)
      }

      //OWN Treasure
      if (this.state.GameInfo?.OwnTreasure?.location != data.OwnTreasure?.location || this.state.GameInfo?.OwnTreasure?.type != data.OwnTreasure?.type) {
        this.removeItemFromMap(data.OwnTreasure?.location!,data.OwnTreasure?.type!)
        this.addItemToMap(data.OwnTreasure?.location!, data.OwnTreasure?.type!)
    
      }

      this.setState({ LastBoatLocation: NewLocation })
      this.setState({ GameInfo: data });
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
    this.interval = setInterval(() => { this.GetDataRequest() }, 200)
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
        if (Key === 'AZ11') {
          uiItems.set(Key,
            <Field className="treasure" SizeH={1} SizeL={1} ColumnStart={columnindex} RowStart={rowindex} key={Key}>
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
    var CreateList: string[] = []
    var RemoveList: string[] = []


    if (ItemKey != "") {
      CreateList = this.createRadius(ItemKey)
    }

    if (this.state.LastBoatLocation !== "") {
      RemoveList = this.removeRadius(this.state.LastBoatLocation, CreateList)
    }

    if (RemoveList.length != 0) {
      for (let index = 0; index < RemoveList.length; index++) {
        var itemFromMap = this.state.uiItems.get(RemoveList[index])
        var classNames: string = itemFromMap?.props.className
        if (classNames) {
          classNames = classNames.replace('inrange', '')
        }
        var item = <Field className={classNames} SizeH={itemFromMap?.props.SizeH} SizeL={itemFromMap?.props.SizeL} ColumnStart={itemFromMap?.props.ColumnStart} RowStart={itemFromMap?.props.RowStart} id={itemFromMap?.key?.toString()} key={itemFromMap?.key?.toString()}>
        </Field>
        this.state.uiItems.set(RemoveList[index], item)
      }
    }

    if (CreateList.length != 0) {
      for (let index = 0; index < CreateList.length; index++) {
        var itemFromMap = this.state.uiItems.get(CreateList[index])
        var item = <Field onClick={(event) => { this.moveBoatFromUi(event.currentTarget.id) }} className="inrange" SizeH={itemFromMap?.props.SizeH} SizeL={itemFromMap?.props.SizeL} ColumnStart={itemFromMap?.props.ColumnStart} RowStart={itemFromMap?.props.RowStart} id={itemFromMap?.key?.toString()} key={itemFromMap?.key?.toString()}>
        </Field>
        this.state.uiItems.set(CreateList[index], item)
      }
    }

    //Boat 
    var itemFromMap = this.state.uiItems.get(ItemKey)
    var item = <Field className={`boat ${itemFromMap?.props.className}`} SizeH={itemFromMap?.props.SizeH} SizeL={itemFromMap?.props.SizeL} ColumnStart={itemFromMap?.props.ColumnStart} RowStart={itemFromMap?.props.RowStart} id={itemFromMap?.key?.toString()} key={itemFromMap?.key?.toString()}>
    </Field>
    this.state.uiItems.set(ItemKey, item)


    this.setState({ uiItems: this.state.uiItems })
  }

  createRadius(ItemKey: string) {

    //Create radius
    //Left top
    var UiList: string[] = [];
    var Row = String.fromCharCode(ItemKey.charCodeAt(0) - 1);
    var Column = Number(ItemKey.substring(1)) - 1;
    UiList.push(Row.toString() + Column.toString())

    //Mid top
    Column = Number(ItemKey.substring(1));
    UiList.push(Row.toString() + Column.toString())


    //Right top
    Column = Number(ItemKey.substring(1)) + 1;
    UiList.push(Row.toString() + Column.toString())

    //Left mid
    var Row = String.fromCharCode(ItemKey.charCodeAt(0));
    var Column = Number(ItemKey.substring(1)) - 1;
    UiList.push(Row.toString() + Column.toString())

    //Mid Mid 
    var Row = String.fromCharCode(ItemKey.charCodeAt(0));
    var Column = Number(ItemKey.substring(1));
    UiList.push(Row.toString() + Column.toString())

    //Right mid
    Column = Number(ItemKey.substring(1)) + 1;
    UiList.push(Row.toString() + Column.toString())

    //Left bottom
    var Row = String.fromCharCode(ItemKey.charCodeAt(0) + 1);
    var Column = Number(ItemKey.substring(1)) - 1;
    UiList.push(Row.toString() + Column.toString())

    //Mid bottom
    Column = Number(ItemKey.substring(1));
    UiList.push(Row.toString() + Column.toString())

    //Right bottom
    Column = Number(ItemKey.substring(1)) + 1;
    UiList.push(Row.toString() + Column.toString())

    return UiList
  }

  removeRadius(ItemKey: string, CreateList: string[]) {


    var UiList: string[] = [];
    //Create radius
    //Left top
    var Row = String.fromCharCode(ItemKey.charCodeAt(0) - 1);
    var Column = Number(ItemKey.substring(1)) - 1;
    if (!CreateList.includes(Row.toString() + Column.toString())) {
      UiList.push(Row.toString() + Column.toString())
    }


    //Mid top
    Column = Number(ItemKey.substring(1));
    if (!CreateList.includes(Row.toString() + Column.toString())) {
      UiList.push(Row.toString() + Column.toString())
    }

    //Right top
    Column = Number(ItemKey.substring(1)) + 1;
    if (!CreateList.includes(Row.toString() + Column.toString())) {
      UiList.push(Row.toString() + Column.toString())
    }

    //Left mid
    var Row = String.fromCharCode(ItemKey.charCodeAt(0));
    var Column = Number(ItemKey.substring(1)) - 1;
    if (!CreateList.includes(Row.toString() + Column.toString())) {
      UiList.push(Row.toString() + Column.toString())
    }

    //Mid mid
    var Row = String.fromCharCode(ItemKey.charCodeAt(0));
    var Column = Number(ItemKey.substring(1));
    if (!CreateList.includes(Row.toString() + Column.toString())) {
      UiList.push(Row.toString() + Column.toString())
    }

    //Right mid
    Column = Number(ItemKey.substring(1)) + 1;
    if (!CreateList.includes(Row.toString() + Column.toString())) {
      UiList.push(Row.toString() + Column.toString())
    }

    //Left bottom
    var Row = String.fromCharCode(ItemKey.charCodeAt(0) + 1);
    var Column = Number(ItemKey.substring(1)) - 1;
    if (!CreateList.includes(Row.toString() + Column.toString())) {
      UiList.push(Row.toString() + Column.toString())
    }

    //Mid bottom
    Column = Number(ItemKey.substring(1));
    if (!CreateList.includes(Row.toString() + Column.toString())) {
      UiList.push(Row.toString() + Column.toString())
    }

    //Right bottom
    Column = Number(ItemKey.substring(1)) + 1;
    if (!CreateList.includes(Row.toString() + Column.toString())) {
      UiList.push(Row.toString() + Column.toString())
    }


    return UiList
  }


  // removeBoat(ItemKey: string) {
  //   if (ItemKey !== ""){

  //     var itemFromMap = this.state.uiItems.get(ItemKey)

  //     var item = <Field className={itemFromMap?.props.className} SizeH={itemFromMap?.props.SizeH} SizeL={itemFromMap?.props.SizeL} ColumnStart={itemFromMap?.props.ColumnStart} RowStart={itemFromMap?.props.RowStart} id={itemFromMap?.key?.toString()} key={itemFromMap?.key?.toString()}>
  //     </Field>

  //     this.state.uiItems.set(ItemKey, item)
  //     this.setState({ uiItems: this.state.uiItems })
  //   }
  // }


  moveBoatFromUi(ItemKey: string) {

    if (this.state.GameInfo?.BoatMovingAllowed) {
      this.SendDataRequest({ BoatLocationRow: ItemKey[0], BoatLocationColumn: Number(ItemKey.substring(1)) })
    }
  }


  addItemToMap(ItemKey: string, Type: string) {
    //Boat 
    var itemFromMap = this.state.uiItems.get(ItemKey)
    var item = <Field className={`${Type} ${itemFromMap?.props.className}`} SizeH={itemFromMap?.props.SizeH} SizeL={itemFromMap?.props.SizeL} ColumnStart={itemFromMap?.props.ColumnStart} RowStart={itemFromMap?.props.RowStart} key={itemFromMap?.key?.toString()}>
    </Field>
    this.state.uiItems.set(ItemKey, item)


    this.setState({ uiItems: this.state.uiItems })
  }

  removeItemFromMap(ItemKey: string, Type: string) {
    if (ItemKey !== "") {

      var itemFromMap = this.state.uiItems.get(ItemKey)

      var classNames: string = itemFromMap?.props.className
      if (classNames) {
        classNames = classNames.replace(Type, '')
      }
      var item = <Field className={classNames} SizeH={itemFromMap?.props.SizeH} SizeL={itemFromMap?.props.SizeL} ColumnStart={itemFromMap?.props.ColumnStart} RowStart={itemFromMap?.props.RowStart} id={itemFromMap?.key?.toString()} key={itemFromMap?.key?.toString()}>
      </Field>

      this.state.uiItems.set(ItemKey, item)
      this.setState({ uiItems: this.state.uiItems })
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
        {/* { <button onClick={event => { this.addItemToMap("B2","treasure") }}>CLICK ON ME</button> } */}
        <FieldWrapper>
          {this.renderObj()}
        </FieldWrapper>
      </>
    );
  }
}
