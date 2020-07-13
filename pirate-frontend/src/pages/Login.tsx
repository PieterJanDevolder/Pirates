import * as React from 'react';
import styled from 'styled-components';
import { useNavigation } from 'react-navi';
import { onLogin } from '../Auth/Auth_Api';
import { Navigation } from 'navi';



export const Wrapper = styled.div`
    display:flex;
    background-color: whitesmoke;
    height:100vh; 
    justify-content:center;
`



export const FormAuth = styled.form`
  background: #F4F4F4 0% 0% no-repeat padding-box;
  margin:10px;
  padding:10px;
  border: 10px;
  border-radius: 5px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  width:200px;
  height:200px;
`

export const Label = styled.label`
  margin : 10px;
  color:black;
  font-size:1.5em;
  font-family:Segoe UI;
  text-align:center;
`


export const Input = styled.input`
    background: #FFFFFF 0% 0% no-repeat padding-box;
    border: 1px solid #CBCBCB;
    border-radius: 5px;
    opacity: 1;
    color: black;
    font-family:Segoe UI;
    font-size: 18px;
    margin: 8px 0;
    padding: 4px;

`

export const Button = styled.button`
       font-size:1.2em;
     background-color: black;
     border: none;
     border-radius:32px;
     padding: 8px 16px;
     color: white;
     font-size: 24px;
     margin-top: 32px;
`


export const BottomWrapper = styled.div`
       display:flex;
`

export const ErrorLabel = styled.div`
  margin : 10px;
  color:red;
  font-size:1.0em;
  font-family:Segoe UI;
  text-align:center;
`

export const Footer = styled.div`
    background: #F4F4F4 0% 0% no-repeat padding-box; 
    display:flex;
    /* justify-content:space-around; */
    /* align-items:center; */
    /* align-content:space-around; */
`


 interface UserCredentials{
  UserName?:string,
  Password?:string,
 }

export interface ILoginProps {
  navigation:Navigation
}

export interface ILoginState {
  error:string,
  UserCredentials : UserCredentials
}



export default class Login extends React.Component<ILoginProps, ILoginState> {
  constructor(props: ILoginProps) {
    super(props);

    this.state = {
      error:"",
      UserCredentials:{UserName:"",Password:""}
    }
  }





  public render() {

    // const { navigation } = this.props;

    const login = async (event: React.FormEvent) => {

      event.preventDefault()
  
      const { error, token,username } = await onLogin({username:this.state.UserCredentials.UserName!, password:this.state.UserCredentials.Password!})

      if (error) {
           this.setState({error:error})
      }
      else {

           this.props.navigation.setContext({ token ,username})
           this.props.navigation.navigate("/")
      }   
  }


    return (
      <Wrapper>
                  <FormAuth onSubmit={(event)=>{ login(event) }}>
                    <Label>Username</Label>
                    <Input placeholder="Username" value={this.state.UserCredentials.UserName} onChange={(event) => this.setState({UserCredentials:{ UserName:event.currentTarget.value, Password: this.state.UserCredentials.Password}})  } ></Input>
                    <Label>Password</Label>
                    <Input placeholder="Password" type="password" value={this.state.UserCredentials.Password} onChange={(event) => this.setState({UserCredentials:{ UserName: this.state.UserCredentials.UserName, Password:event.currentTarget.value}})}></Input>
                     <ErrorLabel>{this.state.error}</ErrorLabel>

                    <Button>Login</Button>     
                </FormAuth>
      </Wrapper>
    );
  }
}
