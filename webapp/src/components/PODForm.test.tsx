import { fireEvent, render } from "@testing-library/react";
import * as PODManager from "./../logic/podManager";
import PODForm from "./PODForm";

test('logintest', async () => {
  const {getByText} = render(<PODForm />)
  
  const button:HTMLElement = getByText("login");
  expect(button).toBeInTheDocument();
})