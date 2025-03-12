"use client";

import { useEffect, useState } from "react";
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
  InputAdornment,
  Modal,
  Tooltip,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HistoryIcon from "@mui/icons-material/History";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { url } from "inspector";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import { Add, QrCode, Remove, Storefront } from "@mui/icons-material";
import { formatCurrencyIDR } from "@/components/functions/IDRFormatter";
import Footer from "@/components/Footer";
import CloseIcon from "@mui/icons-material/Close";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface OrderItem {
  id: number;
  OrderHistoryId: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderHistory {
  id: number;
  orderNo: string;
  items: OrderItem[];
  totalBeforeTax: number;
  totalTax: number;
  tableNo: string;
  total: number;
  paymentMetode: string;
  paymentStatus: string;
  date: string; // Format ISO string atau tanggal biasa
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

// const dummyOrderHistory: OrderHistory[] = [
//   {
//     id: 1,
//     orderNo: "ORD-20250310-001",
//     items: [
//       {
//         id: 101,
//         OrderHistoryId: 1,
//         name: "Nasi Goreng",
//         price: 25000,
//         quantity: 2,
//       },
//       {
//         id: 102,
//         OrderHistoryId: 1,
//         name: "Es Teh Manis",
//         price: 5000,
//         quantity: 1,
//       },
//     ],
//     totalBeforeTax: 55000,
//     totalTax: 6050, // 11% dari 55000
//     total: 61050,
//     date: "2025-03-10",
//   },
//   {
//     id: 2,
//     orderNo: "ORD-20250311-002",
//     items: [
//       {
//         id: 103,
//         OrderHistoryId: 2,
//         name: "Ayam Geprek",
//         price: 20000,
//         quantity: 1,
//       },
//       {
//         id: 104,
//         OrderHistoryId: 2,
//         name: "Jus Alpukat",
//         price: 15000,
//         quantity: 1,
//       },
//     ],
//     totalBeforeTax: 35000,
//     totalTax: 3850, // 11% dari 35000
//     total: 38850,
//     date: "2025-03-11",
//   },
//   {
//     id: 3,
//     orderNo: "ORD-20250312-003",
//     items: [
//       {
//         id: 105,
//         OrderHistoryId: 3,
//         name: "Mie Ayam",
//         price: 18000,
//         quantity: 2,
//       },
//       {
//         id: 106,
//         OrderHistoryId: 3,
//         name: "Teh Tarik",
//         price: 10000,
//         quantity: 1,
//       },
//     ],
//     totalBeforeTax: 46000,
//     totalTax: 5060, // 11% dari 46000
//     total: 51060,
//     date: "2025-03-12",
//   },
// ];

const categories = [...new Set(menuItems.map((item) => item.category))];

const FloatingButton = styled(Fab)({
  position: "fixed",
  bottom: 16,
  right: 16,
});

const STORAGE_KEY = "orderHistory";
const TIMESTAMP_KEY = "orderHistoryTimestamp";

const getMidnightTimestamp = () => {
  const now = new Date();
  now.setUTCHours(17, 0, 0, 0); // GMT+7 -> 12:00 AM (UTC+0 = 17:00)
  return now.getTime();
};

export default function OrderMenu() {
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [openCart, setOpenCart] = useState<boolean>(false);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openHistory, setOpenHistory] = useState(false);
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (typeof window === "undefined") return; // Pastikan hanya berjalan di client

    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedTimestamp = localStorage.getItem(TIMESTAMP_KEY);

    const now = Date.now();
    const midnightTimestamp = getMidnightTimestamp();

    if (!savedTimestamp || Number(savedTimestamp) < midnightTimestamp) {
      // Reset jika sudah lewat jam 12 malam
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(TIMESTAMP_KEY, String(midnightTimestamp));
      setOrderHistory([]);
    } else {
      setOrderHistory(savedData ? JSON.parse(savedData) : []);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orderHistory));
      localStorage.setItem(TIMESTAMP_KEY, String(getMidnightTimestamp()));
    }
  }, [orderHistory]);

  const handleQuantityChange = (id: number, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleQuantityCartChange = (index: number, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      )
    );
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

    // Reset quantity ke 1 setelah ditambahkan
    setQuantities((prev) => ({ ...prev, [item.id]: 1 }));
  };

  const toggleCart = () => {
    setOpenCart(!openCart);
  };

  const totalPrice = cart.reduce(
    (acc, curr) => acc + curr.item.price * curr.quantity,
    0
  );

  const handleRemoveFromCart = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };
  const handleOpenHistory = () => {
    setOpenHistory(true);
  };
  const handleCloseHistory = () => {
    setOpenHistory(false);
  };

  const handleConfirmOrder = () => {
    if (cart.length === 0) return;

    const newOrder: OrderHistory = {
      id: orderHistory.length + 1,
      orderNo: `ORD-${Date.now()}`, // No order unik
      items: cart.map((cartItem, index) => ({
        id: cartItem?.item?.id,
        OrderHistoryId: orderHistory.length + 1,
        name: cartItem.item.name,
        price: cartItem.item.price,
        quantity: cartItem.quantity,
      })),
      totalBeforeTax: totalPrice,
      totalTax: totalPrice * 0.11,
      total: totalPrice * 1.11,
      date: new Date().toISOString(),
      paymentStatus: "pending",
      paymentMetode: paymentMethod,
      tableNo: "1",
    };

    setOrderHistory((prev) => [...prev, newOrder]); // Tambah ke history
    setCart([]); // Kosongkan keranjang
    toggleCart(); // Tutup drawer
  };

  return (
    <Container maxWidth="lg">
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#ff9800",
          backgroundImage: 'url("/background.jpg")',
        }}
      >
        <Toolbar>
          <img src="/r3g.png" alt="Logo" width={30} />
          <Typography
            variant="h6"
            sx={{ marginLeft: 1, flexGrow: 1, fontWeight: "bold" }}
          >
            Menu & Order
          </Typography>

          {/* Tombol History */}
          <Tooltip title="Riwayat Pemesanan" arrow>
            <IconButton color="inherit" onClick={handleOpenHistory}>
              <Badge badgeContent={orderHistory?.length} color="error">
                <HistoryIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Tombol Keranjang */}
          <Tooltip title="Keranjang" arrow>
            <IconButton color="inherit" onClick={toggleCart}>
              <Badge
                badgeContent={cart.reduce(
                  (acc, curr) => acc + curr.quantity,
                  0
                )}
                color="error"
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          position: "sticky",
          top: 64,
          zIndex: 1000,
          backgroundColor: "white",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: 2,
          p: 1,
          mb: 2,
        }}
      >
        <TextField
          fullWidth
          // label="Cari menu..."
          color="warning"
          variant="outlined"
          placeholder="Search..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {categories.map((category) => (
        <Box key={category} sx={{ mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            {category}
          </Typography>
          <Grid container spacing={3}>
            {filteredMenu
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
                        {formatCurrencyIDR(item.price)}
                        {/* Rp {item.price.toLocaleString()} */}
                      </Typography>
                      <Box display="flex" alignItems="center" mt={1}>
                        {/* Tombol - */}
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              (quantities[item.id] || 1) - 1
                            )
                          }
                          disabled={(quantities[item.id] || 1) <= 1}
                        >
                          <Remove />
                        </IconButton>

                        {/* Input Quantity */}
                        <TextField
                          type="number"
                          size="small"
                          value={quantities[item.id] || 1}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              Number(e.target.value)
                            )
                          }
                          sx={{ width: "70px", textAlign: "center", mx: 1 }}
                          inputProps={{
                            min: 1,
                            style: { textAlign: "center" },
                          }}
                        />

                        {/* Tombol + */}
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              (quantities[item.id] || 1) + 1
                            )
                          }
                        >
                          <Add />
                        </IconButton>

                        {/* Tombol Tambah */}
                        <Button
                          variant="contained"
                          startIcon={<AddShoppingCartIcon />}
                          sx={{
                            backgroundColor: "#ff9800",
                            flexGrow: 1,
                            ml: 1,
                          }}
                          onClick={() => {
                            addToCart(item);
                          }}
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

      <FloatingButton sx={{ bgcolor: "#ff9800" }} onClick={toggleCart}>
        <Badge
          badgeContent={cart.reduce((acc, curr) => acc + curr.quantity, 0)}
          color="error"
        >
          <ShoppingCartIcon sx={{ color: "white" }} />
        </Badge>
      </FloatingButton>

      <Drawer anchor="right" open={openCart} onClose={toggleCart}>
        <List sx={{ width: 300, p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            🛒 Keranjang Belanja
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {cart.length === 0 ? (
            <Typography variant="body1" textAlign="center" sx={{ py: 2 }}>
              Keranjang masih kosong
            </Typography>
          ) : (
            cart.map((cartItem, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveFromCart(index)}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={cartItem.item.name}
                  secondary={formatCurrencyIDR(
                    cartItem.item.price * cartItem.quantity
                  )}
                />
                <Box display="flex" alignItems="center">
                  <IconButton
                    size="small"
                    onClick={() =>
                      handleQuantityCartChange(
                        index,
                        Math.max(1, cartItem.quantity - 1)
                      )
                    }
                  >
                    <Remove />
                  </IconButton>
                  <Typography
                    sx={{
                      mx: 1,
                      minWidth: 20,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {cartItem.quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() =>
                      handleQuantityCartChange(index, cartItem.quantity + 1)
                    }
                  >
                    <Add />
                  </IconButton>
                </Box>
              </ListItem>
            ))
          )}

          <Divider sx={{ mt: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography variant="body1">Subtotal:</Typography>
            <Typography variant="body1" fontWeight="bold">
              {formatCurrencyIDR(totalPrice)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography variant="body1">Pajak (11%):</Typography>
            <Typography variant="body1" fontWeight="bold">
              {formatCurrencyIDR(totalPrice * 0.11)}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              Total:
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "#ff9800" }}
            >
              {formatCurrencyIDR(totalPrice * 1.11)}
            </Typography>
          </Box>

          {/* ✅ Pilihan Metode Pembayaran dengan Card */}

          {totalPrice !== 0 && (
            <>
              <Card sx={{ mt: 3, p: 1.5, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="body1" fontWeight="bold">
                    Metode Pembayaran
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <FormControlLabel
                        value="cash"
                        control={<Radio />}
                        label={
                          <Box display="flex" alignItems="center">
                            <Storefront sx={{ mr: 1, color: "#ff9800" }} />
                            Bayar di Kasir
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="qris"
                        disabled
                        control={<Radio />}
                        label={
                          <Box display="flex" alignItems="center">
                            <QrCode sx={{ mr: 1, color: "#ff9800" }} />
                            QRIS
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                </CardContent>
              </Card>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  bgcolor: "#ff9800",
                  "&:hover": { bgcolor: "#e68900" },
                  py: 1.2,
                  fontSize: "1rem",
                  borderRadius: 2,
                }}
                onClick={handleConfirmOrder}
              >
                Konfirmasi Pesanan
              </Button>
            </>
          )}
        </List>
      </Drawer>

      <Modal open={openHistory} onClose={handleCloseHistory}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80vw",
            maxWidth: 700,
            maxHeight: "80vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold">
              Riwayat Pemesanan
            </Typography>
            <IconButton onClick={handleCloseHistory}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />
          <List>
            {orderHistory.length === 0 ? (
              <Typography
                variant="body1"
                textAlign="center"
                sx={{ py: 2 }}
                mb={2}
              >
                Belum ada pesanan
              </Typography>
            ) : (
              orderHistory.map((order) => (
                <Box key={order.id} mb={2}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Meja {order.tableNo}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="textSecondary"
                    >
                      {new Date(order.date).toLocaleDateString("id-ID")}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ color: "#ff9800" }}
                  >
                    {order.orderNo}
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {order.paymentMetode === "cash" ? "Cash" : "QRIS"}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{
                        color: order.paymentStatus === "paid" ? "green" : "red",
                      }}
                    >
                      {order.paymentStatus === "paid"
                        ? "Lunas"
                        : "Belum Dibayar"}
                    </Typography>
                  </Box>

                  {order.items.map((item) => (
                    <ListItem key={item.id}>
                      <ListItemText
                        primary={`${item.name} x${item.quantity}`}
                        secondary={`Rp ${item.price.toLocaleString()}`}
                      />
                    </ListItem>
                  ))}
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Subtotal:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      Rp {order.totalBeforeTax.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Pajak (11%):</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      Rp {order.totalTax.toLocaleString()}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" fontWeight="bold">
                      Total:
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "#ff9800" }}
                    >
                      Rp {order.total.toLocaleString()}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Divider sx={{ py: 2 }} />
                </Box>
              ))
            )}
          </List>
          <Button
            sx={{ bgcolor: "#ff9800" }}
            variant="contained"
            fullWidth
            onClick={handleCloseHistory}
          >
            Tutup
          </Button>
        </Box>
      </Modal>

      <Footer />
    </Container>
  );
}
