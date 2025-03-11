"use client";

import { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Badge,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Fab,
  TextField,
  Stack,
  Tabs,
  Tab,
  styled,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { url } from "inspector";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Nasi Goreng",
    price: 25000,
    image: "/nasi-goreng.jpg",
    description: "Nasi goreng spesial dengan telur, ayam, dan bumbu khas.",
    category: "Makanan",
  },
  {
    id: 2,
    name: "Ayam Bakar",
    price: 30000,
    image: "/ayam-bakar.jpg",
    description: "Ayam bakar dengan bumbu kecap manis dan sambal terasi.",
    category: "Makanan",
  },
  {
    id: 3,
    name: "Es Teh Manis",
    price: 5000,
    image: "/es-teh.jpg",
    description: "Es teh manis segar untuk menemani santapan Anda.",
    category: "Minuman",
  },
  {
    id: 4,
    name: "Soto Ayam",
    price: 27000,
    image: "/soto-ayam.jpeg",
    description: "Soto ayam hangat dengan kuah gurih dan koya.",
    category: "Makanan",
  },
  {
    id: 5,
    name: "Mie Goreng",
    price: 22000,
    image: "/mie-goreng.jpg",
    description: "Mie goreng spesial dengan tambahan ayam dan udang.",
    category: "Makanan",
  },
  {
    id: 6,
    name: "Jus Alpukat",
    price: 12000,
    image: "/jus-alpukat.jpg",
    description: "Jus alpukat kental dengan tambahan susu coklat.",
    category: "Minuman",
  },
];

const categories = [...new Set(menuItems.map((item) => item.category))];

const FloatingButton = styled(Fab)({
  position: "fixed",
  bottom: 16,
  right: 16,
});

export default function OrderMenu() {
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [openCart, setOpenCart] = useState<boolean>(false);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]
  );

  const handleQuantityChange = (id: number, value: string) => {
    const quantity = Math.max(1, parseInt(value) || 1);
    setQuantities((prev) => ({ ...prev, [id]: quantity }));
  };

  const addToCart = (item: MenuItem) => {
    const quantity = quantities[item.id] || 1;
    setCart((prev) => {
      const existingItem = prev.find(
        (cartItem) => cartItem.item.id === item.id
      );
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prev, { item, quantity }];
    });
  };

  const toggleCart = () => {
    setOpenCart(!openCart);
  };

  const totalPrice = cart.reduce(
    (acc, curr) => acc + curr.item.price * curr.quantity,
    0
  );

  return (
    <Container maxWidth="xl">
      <AppBar
        position="sticky"
        sx={{ backgroundImage: 'url("/background.jpg")' }}
      >
        <Toolbar>
          <img
            src="/r3g.png" // Ganti dengan path gambar yang sesuai
            alt="Logo"
            width={30}
            // style={{ width: 120, marginRight: 8 }} // Sesuaikan ukuran gambar
          />
          {/* <MenuBookIcon sx={{ marginRight: 1 }} /> */}
          <Typography variant="h6" sx={{ marginLeft:1, flexGrow: 1, fontWeight: "bold" }}>
            Menu & Order
          </Typography>
          <IconButton color="inherit" onClick={toggleCart}>
            <Badge
              badgeContent={cart.reduce((acc, curr) => acc + curr.quantity, 0)}
              color="error"
            >
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {categories.map((category) => (
        <Box key={category} sx={{ mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            {category}
          </Typography>
          <Grid container spacing={3}>
            {menuItems
              .filter((item) => item.category === category)
              .map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card
                    sx={{
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.image}
                      alt={item.name}
                    />
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {item.description}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        Rp {item.price.toLocaleString()}
                      </Typography>
                      <Box display="flex" alignItems="center" mt={1}>
                        <TextField
                          type="number"
                          size="small"
                          value={quantities[item.id] || 1}
                          onChange={(e) =>
                            handleQuantityChange(item.id, e.target.value)
                          }
                          sx={{ width: "25%", mr: 1 }}
                        />
                        <Button
                          variant="contained"
                          startIcon={<AddShoppingCartIcon />}
                          sx={{ backgroundColor: "#ff9800", flexGrow: 1 }}
                          onClick={() => addToCart(item)}
                        >
                          Tambah
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      ))}

      <FloatingButton sx={{bgcolor: '#ff9800'}} onClick={toggleCart}>
        <Badge
          badgeContent={cart.reduce((acc, curr) => acc + curr.quantity, 0)}
          color="error"
        >
          <ShoppingCartIcon sx={{color: 'white'}}/>
        </Badge>
      </FloatingButton>

      <Drawer anchor="right" open={openCart} onClose={toggleCart}>
        <List sx={{ width: 320, p: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Keranjang
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {cart.length === 0 ? (
            <Typography variant="body1" textAlign="center">
              Keranjang masih kosong
            </Typography>
          ) : (
            cart.map((cartItem, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${cartItem.item.name} x${cartItem.quantity}`}
                  secondary={`Rp ${(
                    cartItem.item.price * cartItem.quantity
                  ).toLocaleString()}`}
                />
              </ListItem>
            ))
          )}
          <Divider sx={{ mt: 2 }} />
          <Typography
            variant="h6"
            fontWeight="bold"
            textAlign="right"
            sx={{ mt: 2 }}
          >
            Total: Rp {totalPrice.toLocaleString()}
          </Typography>
          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => alert("Pesanan dikonfirmasi")}
          >
            Konfirmasi Pesanan
          </Button>
        </List>
      </Drawer>
    </Container>
  );
}
