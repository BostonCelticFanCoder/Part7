import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShowBlogs from "./showBlogs";

test("blog form event handler receives correct props", async () => {
  const mockHandler = vi.fn();
  const user = userEvent.setup();
  const { container } = render(<ShowBlogs createBlog={mockHandler} />);

  const url = screen.getByPlaceholderText("Define URL Here");
  const author = screen.getByPlaceholderText("Define Author Here");
  const title = screen.getByPlaceholderText("Define Title Here");
  const button = container.querySelector(".create");

  await user.type(url, "https://www.MaksimisAwesome.com");
  await user.type(author, "Maksim Yin");
  await user.type(title, "Life of a hero: Maksim Yin");
  await user.click(button);
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(2);
  expect(mockHandler.mock.calls[0][0]).toEqual({
    author: "Maksim Yin",
    title: "Life of a hero: Maksim Yin",
    url: "https://www.MaksimisAwesome.com",
  });
});
