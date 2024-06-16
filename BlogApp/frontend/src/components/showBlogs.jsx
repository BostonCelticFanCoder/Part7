import { useState } from "react";
import { Button, TextField } from "@mui/material";
const ShowBlogs = ({ createBlog }) => {
  const addBlog = (event) => {
    event.preventDefault();
    let title = document.getElementById("title");
    let author = document.getElementById("author");
    let url = document.getElementById("url");
    createBlog({
      title: title.value,
      author: author.value,
      url: url.value,
    });
  };

  return (
    <div>
      <form onSubmit={addBlog}>
        <h2>New Blog</h2>
        <div>
          <TextField variant="standard" label="title" id="title" />
        </div>
        <div>
        <TextField  variant="standard" label="author" id="author" />
        </div>
        <div>
        <TextField variant="standard" label="url" id="url" />
        </div>
        <br></br>
        <Button variant="outlined" color="success" size="small" className="create" type="submit">
          create
        </Button>
      </form>
    </div>
  );
};

export default ShowBlogs;
