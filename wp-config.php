<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'word_com' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost:3307' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         ').^R#)pSrDG+bgYc%e06#12?rv LK_0*=?8%4)+3pKC3_e[tlj(rQ^vz6_rx{|yn' );
define( 'SECURE_AUTH_KEY',  'Zk}bRi[l[f:,jmY?Cxq ]@A.&(Av@I?6(s7tby wt^ ^VA`9(g-/}F3%/eDYCU|&' );
define( 'LOGGED_IN_KEY',    'MTtm?oRq8UN7xV$B}YT]`p?IKJZcWRPi^sBoJXDJ}^9{S<=Aq&O%B89|Qx0=3nWN' );
define( 'NONCE_KEY',        '(b/n;2_|[[`H quxMJY<T9gR*:]~;Uiq6)khfR]4+8D^M)?=PFbfxqr$7w2,*cG3' );
define( 'AUTH_SALT',        'V`(U9;|SGiyN/5]f9K]W`T{tF?O$:((]qKkcbJ.x2+6VaCHBNh<|=.04g-s4G6)3' );
define( 'SECURE_AUTH_SALT', '=#j*jA3v*G-e<pz?t  NC0@4d,BH]iZzRR,moPtg> =B)}D2L?.MkSFhm2/* O6.' );
define( 'LOGGED_IN_SALT',   'WTUGUC5k6R2MK}?*x*{|uGTbTsIg}.R+3mMg*pfO9-%l#n4]MzD Ut`@h!v*Ng/$' );
define( 'NONCE_SALT',       ',;cOp]?8O@%ot+~WMy_/7i0.B-BQ0+pQu^M)1pA6#dxP1HC$x{cH%&s v4aIt{Xm' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
