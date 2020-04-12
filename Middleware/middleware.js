//______ Flash Messages ::Middleware_____
//*setFlash routed with customMware(Flash Middleware)
module.exports.setFlash = (req,res, next) =>{
    res.locals.flash={
        //flash message type
        'success': req.flash('success'),
        'error': req.flash('error')
    }
    next();
}