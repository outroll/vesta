Name:           devit-nginx
Version:        1.0.0
Release:        1
Summary:        devit Control Panel
Group:          System Environment/Base
License:        BSD-like
URL:            http://devitcp.com/
Vendor:         devitcp.com
Source0:        %{name}-%{version}.tar.gz
Source1:        nginx.conf
Source2:        devit.init
Requires:       redhat-release >= 5
Provides:       devit-nginx
BuildRoot:      %{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)

%description
This package contains nginx webserver for devit Control Panel web interface.

%prep
%setup -q -n %{name}-%{version}

%build
./configure --prefix=/usr/local/devit/nginx --with-http_ssl_module
make

%install
make install DESTDIR=%{buildroot} INSTALLDIRS=vendor
%{__install} -p -D -m 0755 %{SOURCE1} %{buildroot}/usr/local/devit/nginx/conf/nginx.conf
%{__install} -p -D -m 0755 %{SOURCE2} %{buildroot}%{_initrddir}/devit
%{__install} -p -D -m 0755  %{buildroot}/usr/local/devit/nginx/sbin/nginx %{buildroot}/usr/local/devit/nginx/sbin/devit-nginx
%clean
rm -rf %{buildroot}

%post
/sbin/chkconfig --add devit

%preun
if [ $1 = 0 ]; then
    /sbin/service devit stop >/dev/null 2>&1
    /sbin/chkconfig --del devit
fi

%postun
if [ $1 -ge 1 ]; then
    if [ -e "/var/run/devit-nginx.pid" ]; then
        /sbin/service devit restart > /dev/null 2>&1 || :
    fi
fi

%files
%defattr(-,root,root)
%attr(755,root,root) /usr/local/devit/nginx
%{_initrddir}/devit
%config(noreplace) /usr/local/devit/nginx/conf/nginx.conf


%changelog
* Tue Jul 30 2013 Serghey Rodin <builder@devitcp.com> - 0.9.8-1
- upgraded to nginx-1.4.2

* Sat Apr 06 2013 Serghey Rodin <builder@devitcp.com> - 0.9.7-2
- new init script

* Wed Jun 27 2012 Serghey Rodin <builder@devitcp.com> - 0.9.7-1
- initial build
