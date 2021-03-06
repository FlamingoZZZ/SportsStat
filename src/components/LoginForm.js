import React from "react";
import { Form, Icon, Input, Button, Checkbox, message } from "antd";
import { observer, inject, Provider } from "mobx-react";
import SportStatServer from "../apis/sportStatServer";

const FormItem = Form.Item;

class LoginForm extends React.Component {
  state = { response: [] };

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);

        SportStatServer.post("/user/login", {
          email: values.email,
          password: values.password
        })
          .then(res => {
            this.props.store.loginModalVisible = false;
            this.props.store.registerModalVisible = false;
            console.log(res);
            this.props.store.user = res.data;
            this.reloadPage();
          })
          .catch(err => {
            console.log("post login info have error");
            message.error("Login failed, please check your information.");
          });
      }
    });
  };

  reloadPage = () => {
    window.location.reload();
  };

  // handleSubmit = async () => {
  //   console.log(values);
  //   const response = await auth.post('/user/login', {
  //     data: {
  //       email: values.email,
  //       password: values.password
  //     }
  //   });

  //   console.log(response);
  //   this.setState({ response: response.data });
  // };

  showRegister = () => {
    console.log("show register");
    this.props.store.registerModalVisible = true;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator("email", {
            rules: [
              { type: "email", message: "The input is not valid E-mail!" },
              { required: true, message: "Please input your email address!" }
            ]
          })(
            <Input
              prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="email"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Please input your Password!" }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("remember", {
            valuePropName: "checked",
            initialValue: true
          })(<Checkbox>Remember me</Checkbox>)}
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          <p />
          <a href="#">Forgot password </a>
          Or{" "}
          <a href="#" onClick={this.showRegister}>
            register now!
          </a>
        </FormItem>
      </Form>
    );
  }
}
LoginForm = inject("store")(observer(LoginForm));
export default LoginForm;
