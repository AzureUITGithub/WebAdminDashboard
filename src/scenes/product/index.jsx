import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import Header from "components/Header";
import {
  useGetPizzasQuery,
  useGetDrinksQuery,
  useGetSidesQuery,
  useGetSaladsQuery,
  useDeletePizzaMutation,
  useDeleteDrinkMutation,
  useDeleteSideMutation,
  useDeleteSaladMutation,
  useCreatePizzaMutation,
  useCreateDrinkMutation,
  useCreateSideMutation,
  useCreateSaladMutation,
  useUpdatePizzaMutation,
  useUpdateDrinkMutation,
  useUpdateSideMutation,
  useUpdateSaladMutation,
} from "state/api";

const Product = ({
  _id,
  name,
  description,
  base_price,
  image_url,
  size,
  crust_type,
  type,
  onDelete,
  onUpdate,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        height: "100%",
      }}
    >
      {image_url && (
        <Box
          sx={{
            width: "150px",
            height: "150px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={image_url}
            alt={name}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      )}
      <Box sx={{ flexGrow: 1 }}>
        <CardContent>
          <Typography
            sx={{ fontSize: 14 }}
            color={theme.palette.secondary[700]}
            gutterBottom
          >
            {type} {size && `(${size})`}
          </Typography>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
          <Typography
            sx={{ mb: "1.5rem" }}
            color={theme.palette.secondary[400]}
          >
            ${Number(base_price).toFixed(2)}
          </Typography>
          <Typography variant="body2">{description}</Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="primary"
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            See More
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={onDelete}
            sx={{ ml: 1 }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={onUpdate}
            sx={{ ml: 1 }}
          >
            Update
          </Button>
        </CardActions>
        <Collapse
          in={isExpanded}
          timeout="auto"
          unmountOnExit
          sx={{ color: theme.palette.neutral[300] }}
        >
          <CardContent>
            <Typography>id: {_id}</Typography>
            {crust_type && <Typography>Crust Type: {crust_type}</Typography>}
            {image_url && <Typography>Image URL: {image_url}</Typography>}
          </CardContent>
        </Collapse>
      </Box>
    </Card>
  );
};

const Products = () => {
  const { data: pizzaData, isLoading: isPizzaLoading } = useGetPizzasQuery();
  const { data: drinkData, isLoading: isDrinkLoading } = useGetDrinksQuery();
  const { data: sideData, isLoading: isSideLoading } = useGetSidesQuery();
  const { data: saladData, isLoading: isSaladLoading } = useGetSaladsQuery();
  const [deletePizza] = useDeletePizzaMutation();
  const [deleteDrink] = useDeleteDrinkMutation();
  const [deleteSide] = useDeleteSideMutation();
  const [deleteSalad] = useDeleteSaladMutation();
  const [createPizza] = useCreatePizzaMutation();
  const [createDrink] = useCreateDrinkMutation();
  const [createSide] = useCreateSideMutation();
  const [createSalad] = useCreateSaladMutation();
  const [updatePizza] = useUpdatePizzaMutation();
  const [updateDrink] = useUpdateDrinkMutation();
  const [updateSide] = useUpdateSideMutation();
  const [updateSalad] = useUpdateSaladMutation();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  const allItems = [
    ...(pizzaData?.map((item) => ({ ...item, type: "Pizza" })) || []),
    ...(drinkData?.map((item) => ({ ...item, type: "Drink" })) || []),
    ...(sideData?.map((item) => ({ ...item, type: "Side" })) || []),
    ...(saladData?.map((item) => ({ ...item, type: "Salad" })) || []),
  ];
  const isLoading = isPizzaLoading || isDrinkLoading || isSideLoading || isSaladLoading;

  const [createForm, setCreateForm] = useState({
    type: "Pizza",
    name: "",
    description: "",
    base_price: "",
    size: "",
    crust_type: "",
  });
  const [updateForm, setUpdateForm] = useState(null);

  const handleDelete = async (id, type) => {
    try {
      if (type === "Pizza") await deletePizza(id).unwrap();
      if (type === "Drink") await deleteDrink(id).unwrap();
      if (type === "Side") await deleteSide(id).unwrap();
      if (type === "Salad") await deleteSalad(id).unwrap();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleUpdate = (item) => {
    setUpdateForm({ ...item, size: item.size || "", crust_type: item.crust_type || "" });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    // Validate required fields
    if (!createForm.name || !createForm.description || !createForm.base_price) {
      console.error("Missing required fields");
      return;
    }
    const data = {
      name: createForm.name,
      description: createForm.description,
      base_price: createForm.base_price,
      ...(createForm.type === "Pizza" && {
        size: createForm.size,
        crust_type: createForm.crust_type,
      }),
    };
    try {
      console.log("Sending data:", data);
      if (createForm.type === "Pizza") {
        await createPizza(data).unwrap();
      } else if (createForm.type === "Drink") {
        await createDrink(data).unwrap();
      } else if (createForm.type === "Side") {
        await createSide(data).unwrap();
      } else if (createForm.type === "Salad") {
        await createSalad(data).unwrap();
      }
      console.log("Create successful");
    } catch (error) {
      console.error("Create failed:", error);
    }
    setCreateForm({
      type: "Pizza",
      name: "",
      description: "",
      base_price: "",
      size: "",
      crust_type: "",
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (updateForm) {
      if (!updateForm.name || !updateForm.description || !updateForm.base_price) {
        console.error("Missing required fields");
        return;
      }
      const data = {
        name: updateForm.name,
        description: updateForm.description,
        base_price: updateForm.base_price,
        ...(updateForm.type === "Pizza" && {
          size: updateForm.size,
          crust_type: updateForm.crust_type,
        }),
      };
      try {
        console.log("Sending update data:", data);
        if (updateForm.type === "Pizza") {
          await updatePizza({ id: updateForm._id, ...data }).unwrap();
        } else if (updateForm.type === "Drink") {
          await updateDrink({ id: updateForm._id, ...data }).unwrap();
        } else if (updateForm.type === "Side") {
          await updateSide({ id: updateForm._id, ...data }).unwrap();
        } else if (updateForm.type === "Salad") {
          await updateSalad({ id: updateForm._id, ...data }).unwrap();
        }
        console.log("Update successful");
      } catch (error) {
        console.error("Update failed:", error);
      }
      setUpdateForm(null);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="MENU" subtitle="See your list of menu items." />
      {/* Create Form */}
      <Box component="form" onSubmit={handleCreate} sx={{ mb: 2, p: 2, border: "1px solid", borderColor: "grey.300" }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={createForm.type}
            onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
          >
            <MenuItem value="Pizza">Pizza</MenuItem>
            <MenuItem value="Drink">Drink</MenuItem>
            <MenuItem value="Side">Side</MenuItem>
            <MenuItem value="Salad">Salad</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Name"
          value={createForm.name}
          onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Description"
          value={createForm.description}
          onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Base Price"
          type="number"
          value={createForm.base_price}
          onChange={(e) => setCreateForm({ ...createForm, base_price: e.target.value })}
          sx={{ mb: 2 }}
        />
        {createForm.type === "Pizza" && (
          <>
            <TextField
              fullWidth
              label="Size"
              value={createForm.size}
              onChange={(e) => setCreateForm({ ...createForm, size: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Crust Type"
              value={createForm.crust_type}
              onChange={(e) => setCreateForm({ ...createForm, crust_type: e.target.value })}
              sx={{ mb: 2 }}
            />
          </>
        )}
        <Button type="submit" variant="contained" color="primary">
          Create
        </Button>
      </Box>
      {/* Update Form */}
      {updateForm && (
        <Box component="form" onSubmit={handleUpdateSubmit} sx={{ mb: 2, p: 2, border: "1px solid", borderColor: "grey.300" }}>
          <Typography variant="h6">Update {updateForm.type}</Typography>
          <TextField
            fullWidth
            label="Name"
            value={updateForm.name}
            onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={updateForm.description}
            onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Base Price"
            type="number"
            value={updateForm.base_price}
            onChange={(e) => setUpdateForm({ ...updateForm, base_price: e.target.value })}
            sx={{ mb: 2 }}
          />
          {updateForm.type === "Pizza" && (
            <>
              <TextField
                fullWidth
                label="Size"
                value={updateForm.size}
                onChange={(e) => setUpdateForm({ ...updateForm, size: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Crust Type"
                value={updateForm.crust_type}
                onChange={(e) => setUpdateForm({ ...updateForm, crust_type: e.target.value })}
                sx={{ mb: 2 }}
              />
            </>
          )}
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
          <Button onClick={() => setUpdateForm(null)} sx={{ ml: 1 }}>
            Cancel
          </Button>
        </Box>
      )}
      {/* Grid of Items */}
      {allItems.length > 0 || !isLoading ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}
        >
          {allItems.map((item) => (
            <Product
              key={item._id}
              _id={item._id}
              name={item.name}
              description={item.description}
              base_price={item.base_price}
              image_url={item.image_url}
              size={item.size}
              crust_type={item.crust_type}
              type={item.type}
              onDelete={() => handleDelete(item._id, item.type)}
              onUpdate={() => handleUpdate(item)}
            />
          ))}
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};

export default Products;