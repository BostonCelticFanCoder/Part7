import { useState, useEffect } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/loginForm";
import ShowBlogs from "./components/showBlogs";
import Togglable from "./components/Togglable";
import { handleNotification } from "./reducers/notificationReducer";
import { useDispatch, useSelector } from "react-redux";
import { initializeBlogs, createNewBlog, deleteBlog, updateBlogs } from "./reducers/blogReducer";
import { setCurrPassword, setCurrUser, setCurrUsername } from "./reducers/userReducer";
import {
  BrowserRouter as Router, Routes, Route, Link,
  useLocation, useNavigate
} from 'react-router-dom'
import {Container, Table, TableBody, TableCell, TableRow, TableContainer, Paper, TableHead, Button, AppBar, Box, Toolbar, IconButton, List, ListItem, Input} from '@mui/material'
import userService from './services/users'
import MenuIcon from '@mui/icons-material/Menu';

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)

  const {user, username, password} = useSelector(state => state.users)
  const [users, setUsers] = useState([])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("user");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      dispatch(setCurrUser(user))
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    dispatch(initializeBlogs())
  }, []);




  const handleLogin = async () => {
    try {
      const user = await loginService.login({
        username,
        password,
      });
      blogService.setToken(user.token);
      window.localStorage.setItem("user", JSON.stringify(user));
      dispatch(setCurrUser(user))
      dispatch(setCurrUsername(username))
      dispatch(setCurrPassword(password))
    } catch (exception) {
      dispatch(handleNotification("wrong username or password"));
    }
  };

  const navigateLogin = () => {
    const navigate = useNavigate()
    console.log("hi!")
    navigate('/login')
  }

  const logout = () => {
    window.localStorage.removeItem("user");
    location.reload();
    navigateLogin()
  };

  const createBlog = ({ title, author, url }) => {
    const blog = {
      title: title,
      author: author,
      url: url,
    }
    dispatch(createNewBlog(blog))
    dispatch(handleNotification(`a new blog ${title} by ${author} added`));
  };

  const updateBlog = async ({ blog }) => {
    const updatedBlog = {
      user: blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      comments: blog.comments,
      id: blog.id
    }
    dispatch(updateBlogs(updatedBlog, blog.id, blog))
  };


  const compareLikes = (a, b) => {
    return b.likes - a.likes;
  };


  useEffect(() => {
    async function fetchData() {
      const users = await userService.getAll()
      setUsers(users)
    }
    fetchData()
  }, [])

  const UserView = () => {
    return (
      <div>
        <h1>Users</h1>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>users</b></TableCell>
                <TableCell><b>blogs created</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...users].map((user) => 
                <TableRow>
                  <TableCell><Link to={`/users/${user.id}`} state={{user: user}}>{user.username}</Link></TableCell>
                  <TableCell>{user.blogs.length}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }

  const SingleUser = () => {
    let {state} = useLocation()
    state = state.user
    return (
      <div>
        <h1>{state.username}</h1>
        <h3>added blogs</h3>
        <List>
          {state.blogs.map((blog) => (
            <ListItem>{blog.title} by {blog.author}</ListItem>
          ))}
        </List>
      </div>
    )
  }

  const SingleBlog = () => {
    let {state} = useLocation()
    let blog = state.blog
    if (blog == null) {
      return null
    }
    let navigate = useNavigate()
    if (!user) {
      return null
    }
    return (
      <div>
        <h1>{blog.title}</h1>
        <div className="content">
          <a className="url" href={blog.url}>
            {blog.url}{" "}
          </a>
          <br></br>
          likes: {blog.likes}{" "}
          <Button
            size="small"
            variant="outlined"
            className="likes"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              updateBlog({ blog: blog });
              navigate('/')
            }}
          >
            like
          </Button>
          <br></br>
          added by {blog.user.username}
          <br></br>
          {user.username === blog.user.username && <Button size="small" variant="outlined" type="submit" onClick={() => {
            dispatch(deleteBlog(blog))
            navigate('/')
          }}>Delete</Button>}
        </div>
        <h3>comments</h3>
        <Input type="text" id="commentField" placeholder="type comment here" />
        <Button variant="contained" size="small" onClick={(e) => {
          const updatedBlog = {
            likes: blog.likes,
            author: blog.author,
            title: blog.title,
            url: blog.url,
            id: blog.id,
            comments: [...blog.comments, document.getElementById("commentField").value],
            user: blog.user
          }
          dispatch(updateBlogs(updatedBlog, blog.id, blog))
          navigate('/')

        }}>add comment</Button>
        <ul>
          {blog.comments.map((comment) => (
            <li>{comment}</li>
          ))}
        </ul>
      </div>
    )
  }

  const padding ={
    paddingRight: 5
  }


  return (
    <Container>
        <Router>
          <div>
            <Box sx={{flexGrow: 1}}>
              <AppBar position="static">
                <Toolbar sx={{ justifyContent: "space-between" }}>
                  <div>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}>
                      <MenuIcon />
                    </IconButton>
                    <Button color="inherit" component={Link} to="/">
                      Blogs
                    </Button>
                    <Button color="inherit" component={Link} to="/users">
                      Users
                    </Button>
                  </div>
                  {user ? (
                    <em>{user.name} logged in <Button color="inherit" onClick={logout} size="small">Logout</Button> </em>)
                    : <Button color="inherit" component={Link} to="/login">Login</Button>
                  }
                </Toolbar>
              </AppBar>
            </Box>
            <Notification />
          </div>

          <Routes>
            <Route path="/" element={(
              <div>
              <h1>Blogs App</h1>
              { user && (<Togglable>
                  <ShowBlogs createBlog={createBlog} />
                </Togglable>)
              }
              <br></br>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Title</b></TableCell>
                      <TableCell><b>Author</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[...blogs].sort(compareLikes).map((blog, index) => (
                    <TableRow key={index} >
                      <TableCell align="left">
                        <Link to={`blogs/${blog.id}`} state={{blog: blog}}>{blog.title}</Link>
                      </TableCell>
                      <TableCell>
                        {blog.author}
                      </TableCell>
                    </TableRow>
                  ))}
                  </TableBody>
                </Table>
              </TableContainer>
              </div>
            )} />
            <Route path="/users" element={<UserView />} />
            <Route path="/users/:id" element={<SingleUser />} />
            <Route path="/blogs/:id" element={<SingleBlog />} />
            <Route path="/login" element={(
                      <LoginForm
                        handleLogin={handleLogin}
                      />)} />
          </Routes>
        </Router>
    </Container>
  );
    
};

export default App;
