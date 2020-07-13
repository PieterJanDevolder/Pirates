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
      data: "pieterjan"
    }
  }


 async componentDidMount() {

    // POST request using fetch with async/await
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'React POST Request Example',username:localStorage.getItem('Username') })
  };
  const response = await fetch('http://localhost:3100/api/handle', requestOptions);
  const data = await response.json();
  console.log(data.username)
  // this.setState({ postId: data.id });
  }


  



  public render() {

    const Logout = () => {
      this.props.navigation.navigate("/Login")
    }

    const username = localStorage.getItem('Username')

    return (

      <div>
        <h1>hi {username}</h1>
        <button onClick={event => { Logout() }}>Logout</button>
      </div>
    );
  }
}
