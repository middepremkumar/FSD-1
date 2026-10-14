import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StatsService } from '../../core/services/stats.service';
import { HealthStatus, SubqueriesResponse } from '../../models/api-response.model';
import { LoadingComponent } from '../../shared/loading/loading.component';

interface LabExperiment {
  id: string;
  unit: string;
  title: string;
  description: string;
  endpoint?: string;
  scriptPath: string;
  npmCommand: string;
  sourceCodeSnippet: string;
}

@Component({
  selector: 'app-lab',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingComponent],
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.css']
})
export class LabComponent implements OnInit {
  private statsService = inject(StatsService);
  private route = inject(ActivatedRoute);

  selectedExperimentId = signal<string>('4a');
  health = signal<HealthStatus | null>(null);
  subqueriesData = signal<SubqueriesResponse | null>(null);
  isLoading = signal<boolean>(true);

  unit4Experiments: LabExperiment[] = [
    {
      id: '4a',
      unit: 'Backend Services',
      title: 'Hello World Server Endpoint',
      description: 'An Express.js program that creates a server, defines a route for the root/endpoint, and responds with a greeting rendered in the browser.',
      endpoint: '/lab/4a',
      scriptPath: 'exercises/unit4/4a_hello_world_route.js',
      npmCommand: 'npm run 4a',
      sourceCodeSnippet: `app.get('/lab/4a', (req, res) => {
  res.send('<h1>Hello World</h1><p>Amazon Express.js Service</p>');
});`
    },
    {
      id: '4b',
      unit: 'Backend Services',
      title: 'Multi-Route Site Service',
      description: 'A modular multi-route Express website featuring home, catalog, deals, prime, and customer service with rich navigation.',
      endpoint: '/lab/4b',
      scriptPath: 'exercises/unit4/4b_multi_route_website.js',
      npmCommand: 'npm run 4b',
      sourceCodeSnippet: `app.get('/lab/4b', (req, res) => res.send('Home'));
app.get('/lab/4b/catalog', (req, res) => res.send('Catalog'));
app.get('/lab/4b/deals', (req, res) => res.send('Deals'));`
    },
    {
      id: '4c',
      unit: 'Backend Services',
      title: 'Browser Console Diagnostic Service',
      description: 'An Express application that serves client-side JavaScript specifically engineered to output diagnostics to the browser DevTools console.',
      endpoint: '/lab/4c',
      scriptPath: 'exercises/unit4/4c_hello_world_console.js',
      npmCommand: 'npm run 4c',
      sourceCodeSnippet: `app.get('/lab/4c', (req, res) => {
  res.send('<script>console.log("Hello World from Express.js Console Route!");</script>');
});`
    },
    {
      id: '4d',
      unit: 'Backend Services',
      title: 'RESTful CRUD Operations API',
      description: 'Full RESTful CRUD operations (GET all, GET by ID, POST new product, PUT update product, and DELETE product) with validation and JSON status responses.',
      endpoint: '/lab/4d',
      scriptPath: 'exercises/unit4/4d_crud_express.js',
      npmCommand: 'npm run 4d',
      sourceCodeSnippet: `router.get('/products', getAll);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);`
    },
    {
      id: '4e',
      unit: 'Backend Services',
      title: 'MySQL Connector & Connection Pool',
      description: 'Establishes a connection between Express API and MySQL using the mysql2 driver with connection pooling, transaction safety, and graceful mock store fallback.',
      endpoint: '/lab/4e',
      scriptPath: 'exercises/unit4/4e_express_mysql.js',
      npmCommand: 'npm run 4e',
      sourceCodeSnippet: `const pool = mysql.createPool({ host, user, password, database });
const [rows] = await pool.query('SELECT * FROM products');`
    }
  ];

  unit5Experiments = [
    {
      id: '5a',
      title: 'Database & Table Schema Definitions',
      file: 'database/5a_create_db_cli.sql',
      description: 'DDL scripts to CREATE DATABASE amazon_fsd_db, define products, categories, orders, and order_items with primary and foreign keys.'
    },
    {
      id: '5b',
      title: 'Data Operations & Mutation Scripts',
      file: 'database/5b_crud_queries.sql',
      description: 'DML operations including bulk inserts, price adjustments, stock increments, conditional updates, and cascading order items.'
    },
    {
      id: '5c',
      title: 'Subquery Analytics Engine (Scalar, IN, EXISTS)',
      file: 'database/5c_subqueries.sql',
      description: 'Advanced subquery patterns: products priced above average, items in specific categories, and categories with active stock.'
    },
    {
      id: '5d',
      title: 'Workbench Views & Stored Procedures',
      file: 'database/5d_workbench_script.sql',
      description: 'Product catalog views, stored procedures (sp_place_order, sp_update_stock), and ACID transaction rollbacks.'
    },
    {
      id: '5e',
      title: 'Database Schema Initialization',
      file: 'database/database.sql',
      description: 'Central project database schema and automated seed runner (database/initDb.js) integrated with Express backend.'
    }
  ];

  get currentExperiment(): LabExperiment {
    return this.unit4Experiments.find(e => e.id === this.selectedExperimentId()) || this.unit4Experiments[0];
  }

  ngOnInit(): void {
    // Check route parameter e.g. /lab/4a
    this.route.params.subscribe(params => {
      const exp = params['exp'];
      if (exp && this.unit4Experiments.some(e => e.id === exp)) {
        this.selectedExperimentId.set(exp);
      }
    });

    this.statsService.getHealth().subscribe({
      next: res => this.health.set(res)
    });

    this.statsService.getSubqueries().subscribe({
      next: res => {
        this.subqueriesData.set(res);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  selectExperiment(id: string): void {
    this.selectedExperimentId.set(id);
  }
}
