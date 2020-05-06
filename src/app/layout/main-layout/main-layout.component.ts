import { Component } from "@angular/core";
import { PlayAppService } from "src/app/core/services/PlayApp.service";
import { MenuItem } from "src/app/core/models/menuitem.model";
import { AuthService } from "src/app/core/services/Auth.service";
import { User } from "src/app/core/models/user.model";

@Component({
  selector: "app-main-layout",
  templateUrl: "./main-layout.component.html",
  styleUrls: ["./main-layout.component.scss"],
})
export class MainLayoutComponent {
  finalMenu: any[] = [];
  menuLoaded: Boolean;
  user: User;

  constructor(
    private playAppService: PlayAppService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.playAppService.getMenu().subscribe((response) => {
      this.renderMenu(response);
    });
    this.user = JSON.parse(localStorage.getItem("user"));
  }

  renderMenu(menu: MenuItem[]) {
    while (menu.length > 0) {
      menu.forEach((menuItem) => {
        menuItem.children = [];

        if (!menuItem.menuFatherId) {
          const index: number = menu.indexOf(menuItem);
          if (index !== -1) {
            menu.splice(index, 1);
          }
          menuItem.opacity = 0;
          this.finalMenu.push(menuItem);
        } else {
          const father = menuItem.menuFatherId;

          this.serachFather(this.finalMenu, father, menuItem, menu);
        }
      });
    }
    this.menuLoaded = true;
  }

  serachFather(menuArray: MenuItem[], father, menuItem: MenuItem, menu) {
    menuArray.forEach((menuPainted) => {
      if (menuPainted.id === father) {
        menuItem.opacity = menuPainted.opacity + 1;
        menuPainted.children.push(menuItem);

        const index: number = menu.indexOf(menuItem);
        if (index !== -1) {
          menu.splice(index, 1);
        }
      } else {
        this.serachFather(menuPainted.children, father, menuItem, menu);
      }
    });
  }

  logOut() {
    this.authService.logOut();
  }
}