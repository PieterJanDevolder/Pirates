import * as React from 'react';
import { Navigation } from 'navi';

export interface IHomeProps {
  navigation: Navigation
}

export interface IHomeState {
  data: any
}

export default class Home extends React.Component<IHomeProps, IHomeState> {
 
  constructor(props: IHomeProps) {
    super(props);

    this.state = {
      data: {}
    }
  }

  interval: any;

async request(){

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

    this.interval = setInterval(()=>{this.request()},1000)

  }

  componentWillUnmount() {
    clearInterval(this.interval );
  }




  public render() {

    const Logout = () => {
      this.props.navigation.navigate("/Login")
    }

    const username = localStorage.getItem('Username')

    return (

      <div>
        <h1>hi {username} BoatLocation = {this.state.data.BoatLocationColumn}</h1>
        <button onClick={event => { Logout() }}>Logout</button>
      </div>
    );
  }
}
