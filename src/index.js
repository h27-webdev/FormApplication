import React, { useState } from "react";
import ReactDOM from "react-dom";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import SearchIcon from "@material-ui/icons/Search";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import PieChartOutlinedIcon from "@material-ui/icons/PieChartOutlined";
import EventOutlinedIcon from "@material-ui/icons/EventOutlined";
import PermContactCalendarIcon from "@material-ui/icons/PermContactCalendar";
import List from "@material-ui/core/List";
import InputAdornment from "@material-ui/core/InputAdornment";
import ListItem from "@material-ui/core/ListItem";
import Snackbar from "@material-ui/core/Snackbar";
import ContactList from "./components/ContactList";
import ContactPreview from "./components/ContactPreview";
import AddEditContactDetails from "./components/AddEditContactDetails";
import data from "./data";
import "./styles.scss";

function App() {
  const [contactAppState, setContactAppState] = useState({
    list: data,
    filteredList: [],
    contactDetails: data[0],
    isAddEditContactModalOpen: false,
    openModalInEditMode: false,
    search: "",
    snackbar: {
      isOpen: true,
      type: "initialWarning",
      initialWarning: {
        message:
          "All adds and edits in the app are temporary and will be lost after page refresh",
        autoHideDuration: null
      },
      operationNotification: {
        message: "",
        autoHideDuration: 3000
      }
    },
    isInitialWarningSnackbarOpen: true,
    operationSnackbar: false
  });

  const openAddContactModal = () => {
    setContactAppState({
      ...contactAppState,
      isAddEditContactModalOpen: true
    });
  };

  const dismissSnackbar = event => {
    debugger;
    const updatedSnackBar = { ...contactAppState.snackbar, isOpen: false };
    setContactAppState({
      ...contactAppState,
      snackbar: updatedSnackBar
    });
  };

  const selectedContactDetails = id => {
    setContactAppState({
      ...contactAppState,
      contactDetails: contactAppState.list.find(contact => {
        return contact.id === id;
      })
    });
  };

  const closeAddContactModal = () => {
    setContactAppState({
      ...contactAppState,
      isAddEditContactModalOpen: false,
      openModalInEditMode: false
    });
  };

  const openInEditMode = () => {
    setContactAppState({
      ...contactAppState,
      isAddEditContactModalOpen: true,
      openModalInEditMode: true
    });
  };

  const handleSearchInput = event => {
    const updatedState = {
      ...contactAppState,
      search: event.target.value,
      filteredList: contactAppState.list.filter(
        contact =>
          contact.name
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) !== -1
      )
    };
    setContactAppState(updatedState);
  };

  const saveContactDetails = newContactDetails => {
    console.log("in saveContactDetails: ", newContactDetails);
    const updatedState = {
      ...contactAppState,
      isAddEditContactModalOpen: false,
      openModalInEditMode: false
    };
    if (contactAppState.openModalInEditMode) {
      updatedState.contactDetails = newContactDetails;
      const editIndex = updatedState.list.findIndex(
        contact => contact.id === newContactDetails.id
      );
      updatedState.list[editIndex] = newContactDetails;
      updatedState.snackbar.operationNotification.message = "Edit Successful";
    } else {
      updatedState.list = [...updatedState.list, newContactDetails];
      updatedState.snackbar.operationNotification.message =
        "You have added a new contact";
    }
    updatedState.snackbar.isOpen = true;
    updatedState.snackbar.type = "operationNotification";
    setContactAppState(updatedState);
  };

  const removeContactDetails = ids => {
    let updateContactList = [];
    ids.forEach(id => {
      updateContactList = contactAppState.list.filter(
        contact => contact.id !== id
      );
    });
    setContactAppState({
      ...contactAppState,
      list: updateContactList
    });
  };

  return (
    <>
      <AppBar position="fixed">
        <ToolBar />
      </AppBar>
      <Drawer variant="permanent">
        <List>
          {[
            HomeOutlinedIcon,
            PersonOutlineOutlinedIcon,
            DescriptionOutlinedIcon,
            PieChartOutlinedIcon,
            EventOutlinedIcon
          ].map(Icon => {
            return (
              <ListItem button>
                <Icon />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <Container classes={{ root: "app-content" }}>
        <Typography variant="h3">
          <PermContactCalendarIcon fontSize="large" />
          Contacts
        </Typography>
        <Typography variant="subtitle1">Welcome to FlatCRM</Typography>
        <Grid container spacing={3}>
          <Grid item xs={7}>
            <div className="grid-content">
              <div className="contact-list-operation">
                <div className="search-input">
                  <Input
                    id="contact-list-search"
                    type="text"
                    placeholder="Search contacts"
                    value={contactAppState.search}
                    onChange={handleSearchInput}
                    endAdornment={
                      <InputAdornment>
                        <SearchIcon />
                      </InputAdornment>
                    }
                  />
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={openAddContactModal}
                  // startIcon={<AddIcon />}
                >
                  Add Contact
                </Button>
              </div>
              <ContactList
                list={
                  !contactAppState.search
                    ? contactAppState.list
                    : contactAppState.filteredList
                }
                removeContactDetails={removeContactDetails}
                selectedContactDetails={selectedContactDetails}
              />
              <AddEditContactDetails
                isOpen={contactAppState.isAddEditContactModalOpen}
                closeModal={closeAddContactModal}
                saveContactDetails={saveContactDetails}
                contactDetails={
                  contactAppState.openModalInEditMode
                    ? contactAppState.contactDetails
                    : null
                }
              />
            </div>
          </Grid>
          <Grid item xs={5}>
            <div className="grid-content">
              <ContactPreview
                data={contactAppState.contactDetails}
                openInEditMode={openInEditMode}
              />
            </div>
          </Grid>
          {console.log("contactAppState.snackbar: ", contactAppState.snackbar)}
          <Snackbar
            open={contactAppState.snackbar.isOpen}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
            autoHideDuration={
              contactAppState.snackbar[contactAppState.snackbar.type]
                .autoHideDuration
            }
            name={contactAppState.snackbar.type}
            onClose={dismissSnackbar}
            message={
              <div id="message-id">
                <span>
                  {
                    contactAppState.snackbar[contactAppState.snackbar.type]
                      .message
                  }
                </span>
              </div>
            }
            action={[
              <Button
                key="undo"
                color="secondary"
                size="small"
                onClick={dismissSnackbar}
              >
                CLOSE
              </Button>
            ]}
          />
        </Grid>
      </Container>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);