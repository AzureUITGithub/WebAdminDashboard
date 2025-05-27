import React, { useState } from "react";
import { Box, useTheme, Button, TextField, Typography, Alert, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useGetCustomersQuery, useDeleteUserMutation, useUpdateUserMutation, useCreateUserMutation } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";

const Users = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetCustomersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [createUser] = useCreateUserMutation();
  const [createForm, setCreateForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    date_of_birth: "",
    role: "user",
  });
  const [updateForm, setUpdateForm] = useState(null);
  const [error, setError] = useState("");

  console.log("data", data);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id).unwrap();
      setError("");
    } catch (err) {
      setError("Failed to delete user: " + (err.data?.error || err.message));
    }
  };

  const handleUpdate = (user) => {
    setUpdateForm({
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address,
      date_of_birth: user.date_of_birth,
      role: user.role,
    });
    setError("");
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!updateForm.username || !updateForm.email) {
      setError("Username and email are required");
      return;
    }
    const data = {
      username: updateForm.username,
      email: updateForm.email,
      phone: updateForm.phone,
      address: updateForm.address,
      date_of_birth: updateForm.date_of_birth,
      role: updateForm.role,
    };
    try {
      console.log("Sending update data:", data);
      await updateUser({ id: updateForm.id, body: data }).unwrap();
      console.log("Update successful");
      setUpdateForm(null);
    } catch (err) {
      setError("Failed to update user: " + (err.data?.error || err.message));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    if (!createForm.username || !createForm.email) {
      setError("Username and email are required");
      return;
    }
    const data = {
      username: createForm.username,
      email: createForm.email,
      password: "defaultPassword123", // Default password, update as needed
      phone: createForm.phone,
      address: createForm.address,
      date_of_birth: createForm.date_of_birth,
      role: createForm.role,
    };
    try {
      console.log("Sending create data:", data);
      await createUser(data).unwrap();
      console.log("Create successful");
      setCreateForm({
        username: "",
        email: "",
        phone: "",
        address: "",
        date_of_birth: "",
        role: "user",
      });
    } catch (err) {
      setError("Failed to create user: " + (err.data?.error || err.message));
    }
  };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "username",
      headerName: "Username",
      flex: 0.5,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 0.5,
      renderCell: (params) => {
        return params.value ? params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3") : "";
      },
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "date_of_birth",
      headerName: "Date of Birth",
      flex: 0.5,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
    },
    {
      field: "image_url",
      headerName: "Image URL",
      flex: 1,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value || "No Image"}
        </a>
      ),
    },
    {
      field: "update",
      headerName: "Update",
      flex: 0.5,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleUpdate(params.row)}
        >
          Update
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.5,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleDelete(params.row._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="USERS" subtitle="List of Users" />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {/* Create Form */}
      <Box
        component="form"
        onSubmit={handleCreate}
        sx={{ mb: 2, p: 2, border: "1px solid", borderColor: "grey.300" }}
      >
        <Typography variant="h6">Create New User</Typography>
        <TextField
          fullWidth
          label="Username"
          value={createForm.username}
          onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Email"
          value={createForm.email}
          onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Phone Number"
          value={createForm.phone}
          onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Address"
          value={createForm.address}
          onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Date of Birth"
          value={createForm.date_of_birth}
          onChange={(e) => setCreateForm({ ...createForm, date_of_birth: e.target.value })}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={createForm.role}
            onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          Create
        </Button>
      </Box>
      {/* Update Form */}
      {updateForm && (
        <Box
          component="form"
          onSubmit={handleUpdateSubmit}
          sx={{ mb: 2, p: 2, border: "1px solid", borderColor: "grey.300" }}
        >
          <Typography variant="h6">Update User</Typography>
          <TextField
            fullWidth
            label="Username"
            value={updateForm.username}
            onChange={(e) => setUpdateForm({ ...updateForm, username: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={updateForm.email}
            onChange={(e) => setUpdateForm({ ...updateForm, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={updateForm.phone}
            onChange={(e) => setUpdateForm({ ...updateForm, phone: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Address"
            value={updateForm.address}
            onChange={(e) => setUpdateForm({ ...updateForm, address: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Date of Birth"
            value={updateForm.date_of_birth}
            onChange={(e) => setUpdateForm({ ...updateForm, date_of_birth: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={updateForm.role}
              onChange={(e) => setUpdateForm({ ...updateForm, role: e.target.value })}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
          <Button onClick={() => setUpdateForm(null)} sx={{ ml: 1 }}>
            Cancel
          </Button>
        </Box>
      )}
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={data || []}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Users;