import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogContent,
  Container,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import {
  Recycling,
  LocationOn,
  ShoppingCart,
  Payments,
  CheckCircle,
  MyLocation,
  Info,
  Description,
} from "@mui/icons-material";
import { useLoadScript, GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import {
  fetchDraftRequestsStart,
  fetchDraftRequestsSuccess,
  fetchDraftRequestsFailure,
  createOrderStart,
  createOrderSuccess,
  createOrderFailure,
} from "../../redux/reducers/OrderCreate/index";

// Default coordinates for Jordan
const DEFAULT_CENTER = { lat: 31.963158, lng: 35.930359 };

// Color palette
const COLORS = {
  primary: "#0E1D40",    // Dark blue
  secondary: "#3A9E1E",  // Green
  accent: "#F3B811",     // Yellow
  background: "#ffffff", // White background 
  lightGray: "#f5f5f5",  // Light gray 
};


const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [successDialog, setSuccessDialog] = useState(false);
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDvBk1nXO5XZP_N9fw-S9_EMTKFy1VA0Fw",
    libraries: ["places"],
  });

  const { token, isLoggedIn, firstName } = useSelector((state) => state.authReducer);

  const { draftRequests = [], loading, error } = useSelector(
    (state) => state.orders
  );
  
  
  const steps = ['Confirm Location', 'Schedule Pickup'];

  useEffect(() => {
    if (!isLoggedIn) return;
    
    const fetchDraftRequests = async () => {
      try {
        dispatch(fetchDraftRequestsStart());
        const response = await axios.get("https://trash2cash-liav.onrender.com/user/getRequestByuserId", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const results = Array.isArray(response.data.result) ? response.data.result : [];
        dispatch(fetchDraftRequestsSuccess(results));
      } catch (err) {
        dispatch(fetchDraftRequestsFailure(err.message || "Failed to fetch draft requests"));
      }
    };

    fetchDraftRequests();
  }, [dispatch, token, isLoggedIn]);

  const handleCreateOrder = () => {
    if (!location.trim()) {
      dispatch(createOrderFailure("Please enter a pickup location"));
      return;
    }

    if (!latitude || !longitude) {
      dispatch(createOrderFailure("Please select a location from the map or suggestions"));
      return;
    }

    dispatch(createOrderStart());
    axios
      .post(
        "https://trash2cash-liav.onrender.com/user/createOrders",
        { location, latitude, longitude },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        dispatch(createOrderSuccess(response.data.order));
        setLocation("");
        setLatitude(null);
        setLongitude(null);
        setSuccessDialog(true);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || "Failed to create order";
        dispatch(createOrderFailure(errorMessage));
      });
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setLatitude(lat);
    setLongitude(lng);
    
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setLocation(results[0].formatted_address);
      }
    });
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          
          if (mapRef.current) {
            mapRef.current.panTo({ lat: latitude, lng: longitude });
            mapRef.current.setZoom(15);
          }
          
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              if (status === "OK" && results[0]) {
                setLocation(results[0].formatted_address);
              }
            }
          );
        },
        (error) => {
          dispatch(createOrderFailure("Unable to retrieve your location"));
        }
      );
    } else {
      dispatch(createOrderFailure("Geolocation not supported"));
    }
  };

  // Calculate total with safeguard for empty array
  const totalPredictedPrice = draftRequests && draftRequests.length > 0 
    ? draftRequests.reduce((sum, request) => sum + Number(request.predicted_price || 0), 0)
    : 0;

  
  if (!isLoaded) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: COLORS.background }}>
      <CircularProgress sx={{ color: COLORS.secondary }} />
    </Box>
  );

  const SuccessAnimation = () => {
    const displayName = firstName || "Recycler";
    
    const handleReturnHome = () => {
      setSuccessDialog(false);
      navigate("/");
    };
    
    return (
      <Dialog 
        open={successDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent sx={{ bgcolor: COLORS.background }}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle sx={{ fontSize: 100, color: COLORS.secondary }} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Typography variant="h4" sx={{ mt: 3, mb: 1, color: COLORS.primary }}>
                Thank you, {displayName}!
              </Typography>
              
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Your recycling pickup has been scheduled
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Typography variant="body1" sx={{ my: 3 }}>
                You're helping our planet,
                Together we can make a difference! 🌍
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Button 
                  variant="contained" 
                  onClick={handleReturnHome}
                  sx={{
                    bgcolor: COLORS.accent,
                    color: COLORS.primary,
                    fontWeight: "bold",
                    "&:hover": {
                      bgcolor: "#e1a800",
                    }
                  }}
                >
                  Return to Homepage
                </Button>
              </Box>
            </motion.div>
          </Box>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      width: "100%", 
      bgcolor: COLORS.background,
      pt: 0, 
      pb: 4 
    }}>
      <SuccessAnimation />
      
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header Section */}
        <Card elevation={3} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
          <CardContent sx={{ 
            background: `linear-gradient(to right, ${COLORS.primary}, #172b5f)`,
            p: 4
          }}>
            <Typography variant="h3" sx={{ 
              mb: 2, 
              display: "flex", 
              alignItems: "center",
              color: "white",
              fontWeight: "500"
            }}>
              <Recycling sx={{ mr: 2, color: COLORS.accent, fontSize: 40 }} />
              RECYCLING COLLECTION
            </Typography>

            <Box sx={{ mb: 0 }}>
              <Alert
                icon={false}
                sx={{
                  bgcolor: COLORS.accent,
                  color: COLORS.primary,
                  fontWeight: "bold",
                  borderRadius: 4,
                  py: 1,
                  px: 3,
                  display: "inline-flex",
                }}
              >
                {draftRequests.length} ITEMS READY FOR PICKUP
              </Alert>
            </Box>
          </CardContent>
        </Card>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Recycling Materials Section */}
          <Grid item xs={12}>
            <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ 
                  mb: 3, 
                  display: "flex", 
                  alignItems: "center",
                  color: COLORS.primary,
                  borderBottom: `2px solid ${COLORS.accent}`,
                  pb: 1
                }}>
                  <ShoppingCart sx={{ mr: 1, color: COLORS.secondary }} /> Your Recycling Materials
                </Typography>

                {draftRequests.length === 0 ? (
                  <Box sx={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center",
                    justifyContent: "center",
                    py: 4,
                    bgcolor: COLORS.lightGray,
                    borderRadius: 2
                  }}>
                    <Info sx={{ fontSize: 60, color: "#9e9e9e", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" align="center">
                      No items in recycling cart
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                      Start adding recyclable items to schedule a pickup
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {draftRequests.map((request, index) => (
                      <Grid item xs={12} sm={6} lg={4} key={request.id || `request-${index}`}>
                        <Card 
                          elevation={1}
                          sx={{ 
                            borderRadius: 2,
                            transition: "transform 0.2s",
                            height: "100%",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: 3
                            },
                            position: 'relative',
                            overflow: 'visible'
                          }}
                        >
                          <Chip 
                            label={`Request #${index + 1}`}
                            sx={{ 
                              position: 'absolute',
                              top: -10,
                              left: 10,
                              backgroundColor: COLORS.primary,
                              color: 'white',
                              fontWeight: 'bold',
                              zIndex: 1
                            }}
                            size="small"
                          />
                          <CardContent sx={{ p: 2, pt: 3 }}>
                            <Grid container alignItems="center" spacing={1}>
                              <Grid item xs={12}>
                                <Typography variant="h6" sx={{ fontWeight: 500, mb: 1, display: 'flex', alignItems: 'center' }}>
                                  {request.category_name || 'Recyclable Item'}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                  display: 'flex', 
                                  alignItems: 'flex-start', 
                                  color: 'text.secondary',
                                  mb: 2
                                }}>
                                  <Description sx={{ fontSize: 16, mr: 0.5, mt: 0.25, color: COLORS.secondary }} />
                                  {request.description }
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Weight: <strong>{request.weight || 0} kg</strong>
                                </Typography>
                                {request.quality && (
                                  <Typography variant="body2" color="text.secondary">
                                    Quality: <strong>{request.quality}</strong>
                                  </Typography>
                                )}
                                {request.condition && (
                                  <Typography variant="body2" color="text.secondary">
                                    Condition: <strong>{request.condition}</strong>
                                  </Typography>
                                )}
                              </Grid>
                              <Grid item xs={6} sx={{ textAlign: "right" }}>
                                <Typography 
                                  variant="h6" 
                                  sx={{ fontWeight: "bold", color: COLORS.secondary }}
                                >
                                  ${request.predicted_price || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Estimated value
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Location Section */}
          <Grid item xs={12} md={7}>
            <Card elevation={2} sx={{ mb: { xs: 3, md: 0 }, borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ 
                  mb: 3, 
                  display: "flex", 
                  alignItems: "center", 
                  color: COLORS.primary,
                  borderBottom: `2px solid ${COLORS.accent}`,
                  pb: 1
                }}>
                  <LocationOn sx={{ mr: 1, color: COLORS.secondary }} /> Pickup Location
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Autocomplete
                    onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                    onPlaceChanged={() => {
                      const place = autocompleteRef.current.getPlace();
                      if (place.geometry) {
                        setLocation(place.formatted_address);
                        setLatitude(place.geometry.location.lat());
                        setLongitude(place.geometry.location.lng());
                        
                        if (mapRef.current) {
                          mapRef.current.panTo({
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng()
                          });
                          mapRef.current.setZoom(15);
                        }
                      }
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Search location in Jordan"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      InputProps={{
                        startAdornment: <LocationOn color="action" sx={{ mr: 1 }} />,
                      }}
                      variant="outlined"
                      sx={{ bgcolor: "white" }}
                    />
                  </Autocomplete>
                </Box>

                <Button
                  onClick={handleUseCurrentLocation}
                  sx={{ 
                    mb: 3,
                    bgcolor: COLORS.accent,
                    color: COLORS.primary,
                    "&:hover": {
                      bgcolor: "#e1a800",
                    },
                    px: 2,
                    fontWeight: "bold"
                  }}
                  variant="contained"
                  startIcon={<MyLocation />}
                  fullWidth
                >
                  DETECT MY LOCATION
                </Button>

                <Box sx={{ 
                  mb: 3, 
                  height: 350,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid #e0e0e0"
                }}>
                  <GoogleMap
                    mapContainerStyle={{ height: "100%", width: "100%" }}
                    center={latitude && longitude ? { lat: latitude, lng: longitude } : DEFAULT_CENTER}
                    zoom={12}
                    onClick={handleMapClick}
                    onLoad={map => {
                      mapRef.current = map;
                    }}
                    options={{
                      zoomControl: true,
                      mapTypeControl: false,
                      streetViewControl: false,
                      fullscreenControl: false,
                    }}
                  >
                    {latitude && longitude && (
                      <Marker 
                        position={{ lat: latitude, lng: longitude }} 
                        icon={{
                          url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                        }}
                      />
                    )}
                  </GoogleMap>
                </Box>

                <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                      <Step key={label} sx={{
                        '& .MuiStepLabel-root .Mui-completed': {
                          color: COLORS.secondary,
                        },
                        '& .MuiStepLabel-root .Mui-active': {
                          color: COLORS.accent,
                        },
                      }}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Payment Summary Section */}
          <Grid item xs={12} md={5}>
            <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h5" sx={{ 
                  mb: 3, 
                  display: "flex", 
                  alignItems: "center",
                  color: COLORS.primary,
                  borderBottom: `2px solid ${COLORS.accent}`,
                  pb: 1
                }}>
                  <Payments sx={{ mr: 1, color: COLORS.secondary }} /> Payment Summary
                </Typography>
                
                <Box sx={{ 
                  flex: '1 0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <Card elevation={0} sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    border: "1px solid #e0e0e0", 
                    bgcolor: COLORS.lightGray,
                    mb: 4
                  }}>
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <Typography variant="body1" fontWeight="medium">
                          Subtotal ({draftRequests.length} items):
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sx={{ textAlign: "right" }}>
                        <Typography variant="body1" fontWeight="medium">
                          ${totalPredictedPrice.toFixed(2)}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={8}>
                        <Typography variant="body1" fontWeight="medium">
                          Service Fee:
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sx={{ textAlign: "right" }}>
                        <Typography variant="body1" sx={{ color: COLORS.secondary, fontWeight: "bold" }}>
                          FREE
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="h6" fontWeight="bold">
                          Total Earnings:
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: "right" }}>
                        <Typography variant="h5" sx={{ color: COLORS.secondary, fontWeight: "bold" }}>
                          ${totalPredictedPrice.toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                  
                  <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 3 }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                      {steps.map((label, index) => (
                        <Step key={label} sx={{
                          '& .MuiStepLabel-root .Mui-completed': {
                            color: COLORS.secondary,
                          },
                          '& .MuiStepLabel-root .Mui-active': {
                            color: COLORS.accent,
                          },
                        }}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>
                  
                  <Box>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleCreateOrder}
                      disabled={loading || !location || !latitude || !longitude || draftRequests.length === 0}
                      sx={{ 
                        py: 2,
                        bgcolor: COLORS.secondary,
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        "&:hover": {
                          bgcolor: "#2b7b16",
                        },
                        "&.Mui-disabled": {
                          bgcolor: "#e0e0e0",
                        }
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "CONFIRM & SCHEDULE PICKUP"
                      )}
                    </Button>
                    
                    <Typography variant="caption" textAlign="center" display="block" sx={{ mt: 2 }}>
                      By confirming, you agree to our recycling terms and conditions
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Cart;