<?php

add_top_menu_item('Monitor targets', '/list?plugin=monitor', true, "Plugin", 1, 'loadMonitorServices');


function addMonitor() {
    $v_type = "";
    $v_hostname = "";
    $v_port = "";
    
    // Check POST request
    if (!empty($_POST['ok'])) {
        // Check token
        if ((!isset($_POST['token'])) || ($_SESSION['token'] != $_POST['token'])) {
            header('location: /login/');
            exit();
        }

        // Check for empty fields
        if (empty($_POST['v_type'])) $errors[] = __('Type');
        if (empty($_POST['v_hostname'])) $errors[] = __('Hostname');
        if (empty($_POST['v_port'])) $errors[] = __('Port');
        if (!empty($errors[0])) {
            foreach ($errors as $i => $error) {
                if ( $i == 0 ) {
                    $error_msg = $error;
                } else {
                    $error_msg = $error_msg.", ".$error;
                }
            }
            $_SESSION['error_msg'] = __('Field "%s" can not be blank.',$error_msg);
        }
        
        // Set type to lowercase
        $v_type = escapeshellarg($_POST['v_type']);
        $v_type = strtolower($v_type);
        
        // Set hostname to lowercase
        $v_hostname = escapeshellarg($_POST['v_hostname']);
        $v_hostname = strtolower($v_hostname);
        
        // Set hostname to lowercase
        $v_port = escapeshellarg($_POST['v_port']);
        $v_port = strtolower($v_port);

        // Add web domain
        if (empty($_SESSION['error_msg'])) {
            exec (VESTA_PLUGIN_CMD."monitor/bin/v-add-monitor-target ".$v_type." ".$v_hostname." ".$v_port." 'yes'", $output, $return_var);
            check_return_code($return_var, $output);
            unset($output);
        }
        
        // Flush field values on success
        if (empty($_SESSION['error_msg'])) {
            $_SESSION['ok_msg'] = __('The monitor target is added');
            unset($v_type);
            unset($v_hostname);
            unset($v_port);
        }
    }

    addMonitorUI($v_type, $v_hostname, $v_port);
    
    // Flush session messages
    unset($_SESSION['error_msg']);
    unset($_SESSION['ok_msg']);
}

function addMonitorUI($v_type, $v_hostname, $v_port) {
    ?>
    <div class="l-center">
        <div class="l-sort clearfix">
            <div class="l-sort-toolbar clearfix float-left">
                <span class="title"><b><?=__('Adding monitor')?></b></span>
                <?php
                if (!empty($_SESSION['error_msg'])) {
                    echo "<span class=\"vst-error\"> → ".htmlentities($_SESSION['error_msg'])."</span>";
                } else {
                    if (!empty($_SESSION['ok_msg'])) {
                        echo "<span class=\"vst-ok\"> → ".$_SESSION['ok_msg']."</span>";
                    }
                }
                ?>
            </div>
        </div>
    </div>

    <div class="l-separator"></div>
    <!-- /.l-separator -->

    <div class="l-center">
        <?php
        $back = $_SESSION['back'];
        if (empty($back)) {
            $back = "location.href='/list?plugin=monitor'";
        } else {
            $back = "location.href='".$back."'";
        }
        ?>

        <form id="vstobjects" name="v_add_monitor" method="post">
            <input type="hidden" name="token" value="<?=$_SESSION['token']?>" />
            <input type="hidden" name="ok" value="Add" />

            <table class="data mode-add">
                <tr class="data-add">
                    <td class="data-dotted">
                        <table class="data-col1">
                            <tr>
                                <td></td>
                            </tr>
                        </table>
                    </td>
                    <td class="data-dotted">
                        <table class="data-col2">
                            <tr>
                                <td class="vst-text step-top">
                                    <?php print __('Type');?>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="text" size="20" class="vst-input" name="v_type" id="v_type" value="<?=htmlentities(trim($v_type, "'"))?>"><!--'-->
                                </td>
                            </tr>
                            <tr>
                                <td class="vst-text input-label">
                                    <?php print __('Hostname'); ?>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="text" size="20" class="vst-input" name="v_hostname" id="v_hostname" value="<?=htmlentities(trim($v_hostname, "'"))?>"><!--'-->
                                </td>
                            </tr>
                            <tr>
                                <td class="vst-text input-label">
                                    <?php print __('Port');?>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="text" size="20" class="vst-input" name="v_port" id="v_port" value="<?=htmlentities(trim($v_port, "'"))?>"><!--'-->
                                </td>
                            </tr>
                        </table>
                        <table class="data-col2">
                            <tr>
                                <td class="step-top" width="116px">
                                    <input type="submit" name="ok" value="<?=__('Add')?>" class="button">
                                </td>
                                <td class="step-top">
                                    <input type="button" class="button cancel" value="<?=__('Back')?>" onclick="<?=$back?>">
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </form>
    </div>
    <?php
}

function loadMonitorServices() {
    if(isset($_GET['page']) && $_GET['page'] == 'add') {
        addMonitor();
    }
    else {
      exec (VESTA_PLUGIN_CMD."monitor/bin/v-list-monitor-targets json", $output, $return_var);
      //$data = json_decode(implode('', $output), true);
      ?>
      <div class="l-center">
        <div class="l-sort clearfix noselect">
          <a href="/list?plugin=monitor&page=add" class="l-sort__create-btn" title="<?=__('Add Monitor Target')?>"></a>
          <div class="l-sort-toolbar clearfix">
            <table>
              <tr>
                <td class="step-right">
                </td>
                <td class="l-sort-toolbar__search-box step-left">
                  <form action="/search/" method="get">
                    <input type="hidden" name="token" value="<?=$_SESSION['token']?>" />
                    <input type="text" name="q" class="search-input" value="<? echo isset($_POST['q']) ? htmlspecialchars($_POST['q']) : '' ?>" />
                    <input type="submit" value="" class="l-sort-toolbar__search" onClick="return doSearch('/search/')" />
                  </form>
                </td>
                <td class="toggle-all">
                  <input id="toggle-all" type="checkbox" name="toggle-all" value="toggle-all" onChange="checkedAll('objects');">
                  <label for="toggle-all" class="check-label toggle-all"><?=__('toggle all')?></label>
                </td>
                <td>
                  
                </td>
              </tr>
            </table>
          </div>
        </div>
        <!-- /.l-sort -->
      </div>

      <div class="l-separator"></div>
      <!-- /.l-separator -->


      <div class="l-center units">
        <?php
          foreach ($data as $key => $value) {
            ++$i;
            ?>
          <div class="l-unit">
            <div class="l-unit-toolbar clearfix">
              <div class="l-unit-toolbar__col l-unit-toolbar__col--left">
                <input id="check<?php echo $i ?>" class="ch-toggle" type="checkbox" name="pkg" value="<?php echo $key ?>">
                <label for="check<?php echo $i ?>" class="check-label"></label>
              </div>
              <!-- l-unit-toolbar__col -->
              <div class="l-unit-toolbar__col l-unit-toolbar__col--right noselect">
                <div class="actions-panel clearfix">
                </div>
                <!-- /.actiona-panel -->
              </div>
              <!-- l-unit-toolbar__col -->
            </div>
            <!-- /.l-unit-toolbar -->

            <div class="l-unit__col l-unit__col--left clearfix">
              <div class="l-unit__date">
                <?=translate_date($value['DATE'])?>
              </div>
            </div>
            <!-- /.l-unit__col -->
            <div class="l-unit__col l-unit__col--right">
              <div class="l-unit__name separate">
                <?=__($data[$key]['TYPE'])?>
              </div>



              <div class="l-unit__stats">
                <table>

                   <tr>
                    <td>
                      <div class="l-unit__stat-cols clearfix">
                        <div class="l-unit__stat-col l-unit__stat-col--left"><b><?=__($value['HOSTNAME'])?></b></div>
                        <div class="l-unit__stat-col l-unit__stat-col--right">
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="l-unit__stat-cols clearfix">
                        <div class="l-unit__stat-col l-unit__stat-col--left compact"><?=__('Port')?>:</div>
                        <div class="l-unit__stat-col l-unit__stat-col--right">
                          <b><?=$value['PORT'] ?></b>
                        </div>
                      </div>
                    </td>
                  </tr>

                </table>
              </div>
              <!-- /.l-unit__stats -->
            </div>
            <!-- /.l-unit__col -->
          </div>
          <!-- /.l-unit -->
          <!-- div class="l-separator"></div -->
          <!-- /.l-separator -->
        <?}?>

      </div>

      <div id="vstobjects">
          <div class="l-separator"></div>
    </div>


      <?php
    }
}