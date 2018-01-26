<?php

// This condition check is needed for phpunit tests
if (!defined('SLIM_SRC_DIR')) {
    define('SLIM_SRC_DIR', __DIR__);

    // Settings
    define('ISSUE_LIST_PER_PAGE_LIMIT', 6);
    define('ISSUE_COMMENT_LIST_PER_PAGE_LIMIT', 6);

    // Github app settings
    define('GITHUB_APP_CLIENT_ID', '6a6902b8117d8ec1a274');
    define('GITHUB_APP_CLIENT_SECRET', '5f12f37f76b985556559312ed1ca4a63f5cdc10e');
    //define('GITHUB_APP_NAME', 'Konstantinas_T__Tesonet_Full_Stack_Party');
    define('GITHUB_APP_AUTH_URL_BASE', 'https://github.com/login/oauth/authorize/');
    define('GITHUB_APP_ACCESS_TOKEN_GENERATOR', 'https://github.com/login/oauth/access_token');
}
