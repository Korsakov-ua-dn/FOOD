<?php
$_POST = json_decode(file_get_contents("php://input"), true);
/* для работы с json фалами в php необходимо их декодировать */
echo var_dump($_POST);
