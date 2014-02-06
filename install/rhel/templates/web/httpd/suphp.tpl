  <VirtualHost %ip%:%web_port%>

    ServerName %domain_idn%
    %alias_string%
    ServerAdmin %email%
    DocumentRoot %docroot%
    ScriptAlias /cgi-bin/ %home%/%user%/web/%domain%/cgi-bin/
    Alias /vstats/ %home%/%user%/web/%domain%/stats/
    Alias /error/ %home%/%user%/web/%domain%/document_errors/
    CustomLog /var/log/%web_system%/domains/%domain%.bytes bytes
    CustomLog /var/log/%web_system%/domains/%domain%.log combined
    ErrorLog /var/log/%web_system%/domains/%domain%.error.log

    <IfModule itk.c>
        AssignUserID %user% %group%
    </IfModule>
        <IfModule !mod_ruid2.c>
                SuexecUserGroup %user% %group%
        </IfModule>
#        <IfModule mod_ruid2.c>
#                RMode config
#                RUidGid %user% %group%
#                RGroups apache
#        </IfModule>
        <Directory %docroot%>
                AllowOverride All
                Options +Includes -Indexes
                suPHP_Engine ON
                suPHP_UserGroup %user% %group%
        </Directory>
    <Directory %home%/%user%/web/%domain%/stats>
        AllowOverride All
    </Directory>

</VirtualHost>
