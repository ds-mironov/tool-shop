import { reloadPage } from "../utils/helpers";
import checkEmailField from "./checkEmailField";
import ToolsShopApi from "../api/toolsShopApi";
import changeCartHeader from "../header/changeCartHeader";
import { displayLogoutBlock } from "./displayAuthBlock";

export default function passSingIn() {
  const toolsShopApi = new ToolsShopApi();

  const inputEmail = document.querySelectorAll(".header__login_input")[0];
  const formLogin = document.forms[0];

  inputEmail.addEventListener("blur", () => checkEmailField(inputEmail));

  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    let emailEntered = formLogin.elements.login.value;
    let passwordEntered = formLogin.elements.password.value;

    if (emailEntered === "" || passwordEntered === "") {
      alert("Fill in the fields");
      return false;
    }

    toolsShopApi.checkEmail(emailEntered).then(([user]) => {
      if (typeof user == "undefined") {
        alert("User with this E-mail does not exist");
      } else {
        const { id, email, password, cart, total } = user;
        if (password === passwordEntered) {
          displayLogoutBlock(email, id);
          changeCartHeader(cart, total);
          toolsShopApi.patchData(id, { isLoggied: true });
          document.cookie = `email=${email}`;
          reloadPage();
        } else {
          alert("Wrong password entered");
        }
      }
    });
  });

  return null;
}
