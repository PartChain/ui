import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetSearchSkeletonComponent } from './asset-search-skeleton.component';

describe('AssetSearchSkeletonComponent', () => {
  let component: AssetSearchSkeletonComponent;
  let fixture: ComponentFixture<AssetSearchSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetSearchSkeletonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetSearchSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
