<?php

add_top_menu_item('Monitor Dashboard', '/list?plugin=monitor-dashboard', true, "Plugin", 1, 'loadMonitorDashboard');

function loadMonitorDashboard() {
    $version = null;
    exec('composer -V', $version);
    $version = implode("", $version);
    preg_match_all("/([0-9.]* )/", $version, $output_array);
    
    $fetchLatestVersion = json_decode(file_get_contents("https://getcomposer.org/versions"), true);
    print_r($fetchLatestVersion['stable'][0]['version']);
    $latestVersion = $fetchLatestVersion['stable'][0]['version'];
    
    $updated = 'no';
    if($latestVersion == trim($output_array[0][2])) {
        $updated = 'yes';
    }
    $data = [
        'Composer' => [
            'VERSION' => $output_array[0][2],
            'UPDATED' => $updated,
            'LATEST' => $latestVersion,
            'DESCR' => '',
        ]
    ];
    ?>
    <div class="l-center">
      <div class="l-sort clearfix noselect">
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
                <form action="/list?plugin=composer" method="post" id="objects">
                <input type="hidden" name="token" value="<?=$_SESSION['token']?>" />
                <div class="l-select">
                  <select name="action" id="">
                    <option value=""><?=__('apply to selected')?></option>
                    <option value="update"><?php print __('update') ?></option>
                  </select>
                </div>
                <input type="submit" value="" class="l-sort-toolbar__filter-apply" />
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

          if ($data[$key]['UPDATED'] == 'yes') {
            $status = 'active';
            $upd_status = 'updated';
          } else {
            $status = 'suspended';
            $upd_status = 'outdated';
          }

      ?>




      <div class="l-unit<? if($status == 'suspended') echo ' l-unit--outdated';?>">
        <div class="l-unit-toolbar clearfix">
          <div class="l-unit-toolbar__col l-unit-toolbar__col--left">
            <input id="check<?php echo $i ?>" class="ch-toggle" type="checkbox" name="pkg" value="<?php echo $key ?>">
            <label for="check<?php echo $i ?>" class="check-label"></label>
          </div>
          <!-- l-unit-toolbar__col -->
          <div class="l-unit-toolbar__col l-unit-toolbar__col--right noselect">
            <div class="actions-panel clearfix">
              <? if ($data[$key]['UPDATED'] == 'no') {
                   echo '<div class="actions-panel__col actions-panel__update shortcut-u" key-action="href"><a href="/list?plugin=composer&update='.$key.'&token='.$_SESSION['token'].'">'.__('update').'<i></i></a><span class="shortcut">&nbsp;U</span></div>';
                 }
              ?>
            </div>
            <!-- /.actiona-panel -->
          </div>
          <!-- l-unit-toolbar__col -->
        </div>
        <!-- /.l-unit-toolbar -->

        <div class="l-unit__col l-unit__col--left clearfix">
          <div class="l-unit__date">
            <?=__($upd_status)?>
          </div>
        </div>
        <!-- /.l-unit__col -->
        <div class="l-unit__col l-unit__col--right">
          <div class="l-unit__name separate">
            <?=$key?>
          </div>



          <div class="l-unit__stats">
            <table>

               <tr>
                <td>
                  <div class="l-unit__stat-cols clearfix">
                    <div class="l-unit__stat-col l-unit__stat-col--left"><b><?=__($data[$key]['DESCR'])?></b></div>
                    <div class="l-unit__stat-col l-unit__stat-col--right">
                    </div>
                  </div>
                </td>
                <td>
                  <div class="l-unit__stat-cols clearfix">
                    <div class="l-unit__stat-col l-unit__stat-col--left compact"><?=__('Version')?>:</div>
                    <div class="l-unit__stat-col l-unit__stat-col--right">
                      <b><?=$data[$key]['VERSION'] ?></b> (<?=$data[$key]['LATEST'] ?>)
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