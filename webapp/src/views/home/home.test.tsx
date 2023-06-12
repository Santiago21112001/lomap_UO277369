import { render } from "@testing-library/react";
import Home from "./home";
test('hometest', async () => {
  const {getByText} = render(<Home />)
  
  const text:HTMLElement = getByText("Mapa.");
  expect(text).toBeInTheDocument();
})