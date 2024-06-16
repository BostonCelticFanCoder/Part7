import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

describe("<Blog />", () => {
  let blog = {
    author: "Maksim Yin",
    title: "Maksim is awesome",
    url: "https://Maksim.com",
    likes: 30,
    user: {
      username: "Maksim",
    },
  };
  let Maksim = {
    username: "Maksim",
    name: "Maksim Yin",
  };

  test("blog renders title and author by default", () => {
    const { container } = render(<Blog blog={blog} user={Maksim} />);
    const div = container.querySelector(".blog");
    expect(div).toHaveTextContent(`${blog.title} ${blog.author}`);
  });
  test("blog renders number of likes and URL when button showing details is clicked", async () => {
    const { container } = render(<Blog blog={blog} user={Maksim} />);
    const user = userEvent.setup();
    const button = document.querySelector(".details");
    await user.click(button);
    const div = container.querySelector(".content");
    expect(div).toHaveTextContent(`${blog.url}`);
    expect(div).toHaveTextContent(`likes: ${blog.likes}`);
  });
  test("When like button clicked twice, handler works properly", async () => {
    const user = userEvent.setup();
    const mockHandler = vi.fn();
    const { container } = render(
      <Blog blog={blog} user={Maksim} updateBlog={mockHandler} />,
    );
    const button = container.querySelector(".likes");
    await user.click(button);
    await user.click(button);
    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
