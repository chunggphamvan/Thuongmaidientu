import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { Alert, Button, Divider, FormControl, FormControlLabel, Grid, Paper, Radio, RadioGroup, Stack, Typography } from '@mui/material';
//dialog:
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from "react-toastify";
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import userApi from '../../api/userApi';
import { addToCart, clearCart, decreaseCart, getTotals, removeFromCart } from './cartSlice';
import orderApi from '../../api/orderApi';

CartFeature.propTypes = {

};
const useStyles = makeStyles({
    root: {
        maxWidth: '1300px',
        margin: '0 auto'
    },

    containerImage: {
        justifyContent: 'center'
    },
    imageProduct: {
        flex: '1',
    },
    titleProduct: {
        flex: '2',
        padding: '8px 16px',
        cursor: 'pointer',
        '& > a': {
            color: 'black',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
        },
        '&>a:hover': {
            color: 'RGB(61, 118, 181)'
        },
    },
    rootTotal: {
        padding: '16px 16px',
        marginTop: '16px'
    },
    subTotal: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '4px 0'
    },
    labelSubTotal: {
        color: '#5c5c5c'
    },
    changeAddress: {
        color: 'black',
    },
    changeAddressItem: {
        padding: '4px 8px',
        cursor: 'pointer',
        borderBottom: '1px solid RGB(245, 245, 245)',
        '&:hover': {
            backgroundColor: 'RGB(245, 245, 245)',
            borderRadius: '3px'
        }
    }
})
const PRICE_SHIP = {
    deliverynormal: 1.5,
    deliveryspeed: 3
}
function CartFeature(props) {
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const [address, setAddress] = useState([])
    const [loading, setLoading] = useState(true)
    const [addressIndex, setAddressIndex] = useState(0)
    const [delivery, setDelivery] = useState('deliverynormal')
    useEffect(() => {
        (async () => {
            try {
                const response = await userApi.getAddress();
                setAddress(response)
                setLoading(false)
            }
            catch (error) {
                console.log('loi roi', error);
            }

        })();
    }, [])
    const { cartItems, cartTotalAmount, cartTotalQuantity } = cart

    const classes = useStyles()
    // dialog :
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    //dispatch cart
    useEffect(() => {
        dispatch(getTotals());
    }, [cart, dispatch]);

    const handleChangeAddress = (index) => {
        setAddressIndex(index)
        setOpen(false);
    }
    const handleChangeDelivery = (e) => {
        const value = e.target.value
        setDelivery(value)
    }
    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };
    const handleDecreaseCart = (product) => {
        dispatch(decreaseCart(product));
    };
    const handleRemoveFromCart = (product) => {
        dispatch(removeFromCart(product));
    };
    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const handleClickOrder = () => {
        const cart_items = cartItems.map((item) => {
            return {
                id: item.id,
                quantity: item.cartQuantity,
            }
        })
        if (cart_items.length <= 0) return;
        const data = {
            price_ship: PRICE_SHIP[delivery],
            receiving_address: address[addressIndex].address_detail,
            total_price: PRICE_SHIP[delivery] + cartTotalAmount,
            cart_items,
        }
        async function fetchData(data) {
            try {
                const response = await orderApi.createOrder(data)

                console.log(response)
                toast.info("T???o ????n h??ng th??nh c??ng, b???n c?? th??? xem t???i ????n h??ng c???a m??nh ", {
                    position: "top-right",
                });
                handleClearCart()
            }
            catch (error) {
                console.log('loi roi', error);
            }
        }
        fetchData(data)
    }
    return (
        <Box className={classes.root}>
            <Grid container >
                <Stack sx={{ width: '100%' }} spacing={2} p='12px 0'>
                    <Alert severity="info">Do ???nh h?????ng c???a d???ch Covid-19, m???t s??? khu v???c c?? th??? nh???n h??ng ch???m h??n d??? ki???n. Tiki ??ang n??? l???c giao c??c ????n h??ng trong th???i gian s???m nh???t. C??m ??n s??? th??ng c???m c???a qu?? kh??ch!</Alert>
                    <Alert severity="info">
                        <Typography component='span' fontSize='13px' marginRight='8px'>Mi???n ph?? v???n chuy???n ????n t??? 149K c???a m???i nh?? b??n c?? logo</Typography>

                        <img src="https://salt.tikicdn.com/ts/upload/3d/e3/de/2c71b5485f7335d41cb3c06198035fe3.png" alt="icon" width="76" height="12" ></img>
                    </Alert>
                </Stack>
            </Grid>
            <Grid container padding='12px 0'>
                <Grid item xs={12} sm={6} md={9} lg={9} display='flex' justifyContent='space-between'>
                    <Typography component='h2' variant='' >Gi??? H??ng</Typography>
                    <Button variant="outlined" color='error' startIcon={<DeleteIcon />}
                        onClick={() => {
                            if (window.confirm("B???n mu???n xo?? t???t c??? s???n ph???m")) {
                                handleClearCart()
                            }
                        }}
                    >
                        Clear
                    </Button>
                </Grid>
            </Grid>



            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={9} lg={9}>
                    <Paper elevation={0}>
                        <Grid container padding={1} fontWeight='600' margin='16px 0'>
                            <Grid item md={5} lg={5}>
                                S???n Ph???m
                            </Grid>
                            <Grid item md={2} lg={2}>
                                ????n Gi??
                            </Grid>
                            <Grid item md={2} lg={2}>
                                S??? L?????ng
                            </Grid>
                            <Grid item md={2} lg={2}>
                                Th??nh Ti???n
                            </Grid>
                            <Grid item md={1} lg={1}>
                                <DeleteForeverOutlinedIcon />
                            </Grid>
                        </Grid>
                    </Paper>
                    <Paper elevation={0}>

                        {
                            cartItems.map((cartItem) => {
                                return (
                                    <Grid container padding={1} fontWeight='600' key={cartItem.id} alignItems='center'
                                        borderBottom='1px solid RGB(243, 243, 243)' >
                                        <Grid item md={5} lg={5} display='flex' alignItems='center'>


                                            <img src={cartItem.img_url[0]} width='100px' alt={cartItem.name}></img>
                                            <Box className={classes.titleProduct}>
                                                <Link to={`/product/${cartItem.id}`} >{cartItem.name}</Link>
                                            </Box>


                                        </Grid>
                                        <Grid item md={2} lg={2}>
                                            <Typography component='span' sx={{ fontWeight: 600 }}>
                                                {cartItem.price}$
                                            </Typography>
                                            <Typography component='span'
                                                sx={{ fontSize: '12px', textDecoration: 'line-through', color: '#666', marginLeft: '2px' }}>
                                                {cartItem.price_old}$
                                            </Typography>


                                        </Grid>
                                        <Grid item md={2} lg={2}>
                                            <Box display='flex' alignItems='center' >
                                                <IconButton aria-label="decrement" size="small" onClick={() => handleDecreaseCart(cartItem)}>
                                                    <RemoveCircleOutlineIcon />
                                                </IconButton>
                                                <Typography sx={{ fontSize: '18px', p: '4px 4px' }}>{cartItem.cartQuantity}</Typography>

                                                <IconButton aria-label="increment" size="small" onClick={() => handleAddToCart(cartItem)}>
                                                    <AddCircleOutlineIcon />
                                                </IconButton>
                                            </Box>

                                        </Grid>
                                        <Grid item md={2} lg={2}>
                                            <Typography color='RGB(255, 89, 121)'>{parseFloat((cartItem.cartQuantity * cartItem.price).toFixed(2))}$</Typography>

                                        </Grid>
                                        <Grid item md={1} lg={1}>
                                            <DeleteForeverOutlinedIcon
                                                style={{ fill: 'red', cursor: 'pointer', p: '4px 6px' }}
                                                onClick={() => {
                                                    if (window.confirm("B???n mu???n xo?? s???n ph???m kh???i gi??? h??ng")) {
                                                        handleRemoveFromCart(cartItem)
                                                    }
                                                }}
                                            />
                                        </Grid>

                                    </Grid>
                                )
                            })
                        }
                    </Paper>


                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={3}>
                    <Paper elevation={0}>
                        <Box padding={1} margin='16px 16px 0 0'>
                            <Box display='flex' justifyContent='space-between' >
                                <Typography fontWeight='600'>Giao t???i</Typography>
                                <Box display='flex' alignItems='center'>
                                    <EditLocationOutlinedIcon />
                                    <Typography
                                        sx={{ fontSize: '14px', color: 'RGB(61, 118, 181)', cursor: 'pointer' }}
                                        onClick={handleClickOpen}
                                    >Thay ?????i</Typography>
                                </Box>

                            </Box>
                            {loading === false && address.length > 0 && (
                                <Box >
                                    <Typography component='span'>{address[addressIndex].recipient_name}</Typography>
                                    <Typography component='span' p='0px 12px' color='#999'>|</Typography>
                                    <Typography component='span'>{address[addressIndex].recipient_phone}</Typography>
                                    <Box sx={{ fontSize: '14px', color: '#777' }}>{address[addressIndex].address_detail}</Box>
                                </Box>

                            )}
                        </Box>
                    </Paper>

                    <Paper elevation={0}>
                        <Box padding={1} margin='16px 16px 0 0'>
                            <Box display='flex' justifyContent='space-between' >
                                <Typography fontWeight='600'>Ch???n h??nh th???c giao h??ng</Typography>

                                <LocalShippingOutlinedIcon />

                            </Box>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    aria-label="abc"
                                    defaultValue="deliverynormal"
                                    name="radio-buttons-group"
                                    onChange={handleChangeDelivery}
                                >
                                    <FormControlLabel value="deliverynormal" control={<Radio />} label="Giao Ti???t Ki???m" />
                                    <FormControlLabel value="deliveryspeed" control={<Radio />} label="Giao Ho??? T???c" />
                                </RadioGroup>
                            </FormControl>

                        </Box>
                    </Paper>

                    <Paper elevation={0}>
                        <Box className={classes.rootTotal}>
                            <Box className={classes.subTotal} >
                                <Typography className={classes.labelSubTotal} >T???ng S???n Ph???m</Typography>
                                <Typography>{cartTotalQuantity}</Typography>
                            </Box>
                            <Box className={classes.subTotal}>
                                <Typography className={classes.labelSubTotal}>T???m t??nh</Typography>
                                <Typography>{cartTotalAmount}$</Typography>
                            </Box>
                            <Box className={classes.subTotal}>
                                <Typography className={classes.labelSubTotal}>Ph?? v???n chuy???n</Typography>
                                <Typography>{PRICE_SHIP[delivery]}$</Typography>
                            </Box>
                            <Box className={classes.subTotal}>
                                <Typography className={classes.labelSubTotal}>Gi???m Gi??</Typography>
                                <Typography>0</Typography>
                            </Box>
                            <Divider />
                            <Box className={classes.subTotal} margin='16px 0 0 0'>
                                <Typography className={classes.labelSubTotal}>T???ng c???ng</Typography>
                                <Typography color='red'>{cartTotalAmount + PRICE_SHIP[delivery]}$</Typography>
                            </Box>
                        </Box>

                    </Paper>
                    <Box marginTop='16px'>
                        <Button variant='contained' fullWidth onClick={handleClickOrder} >Mua H??ng</Button>
                    </Box>


                </Grid>
            </Grid>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle display='flex' alignItems='center'>
                    <EditLocationOutlinedIcon />
                    <Typography fontWeight='bold'>
                        Vui L??ng ch???n ?????a ch??? giao h??ng
                    </Typography>
                </DialogTitle>
                <Divider></Divider>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <Box className={classes.changeAddress}>
                            {address.map((add, index) => {
                                return (
                                    <Box
                                        key={index}
                                        className={classes.changeAddressItem}
                                        onClick={() => handleChangeAddress(index)}>
                                        <Typography component='span'>{add.recipient_name}</Typography>
                                        <Typography component='span' p='0px 12px' color='#999'>|</Typography>
                                        <Typography component='span'>{add.recipient_phone}</Typography>
                                        <Box sx={{ fontSize: '14px', color: '#777' }}>{add.address_detail}</Box>
                                    </Box>
                                )
                            })}
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>????ng</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )

};


export default CartFeature;